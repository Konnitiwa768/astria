let scurpterKillCount = 0
let inPhase2 = false

// phase2への移行
EntityEvents.death(event => {
  const killer = event.source.entity
  if (!killer || killer.type != 'kubejs:scurpter') return

  scurpterKillCount++
  if (scurpterKillCount >= 100 && !inPhase2) {
    const pos = killer.blockPosition()
    killer.level.setBlock(pos, Block.id('minecraft:sculk_catalyst').defaultState)
    inPhase2 = true
    console.log('=== PHASE 2 移行 ===')
  }
})

// sulcon_lv1のスポーン制御（スカルク上のみ）
WorldgenEvents.onEntitySpawn(event => {
  if (!inPhase2 || event.entity.type != 'kubejs:sulcon_lv1') return
  const block = event.level.getBlock(event.entity.blockPosition())
  if (block.id != 'minecraft:sculk') {
    event.cancel()
  }
})

// AI・範囲攻撃・強化バフ
EntityEvents.tick(event => {
  const e = event.entity
  if (e.type != 'kubejs:sulcon_lv1') return

  // 動かないように固定
  e.motionX = 0
  e.motionY = 0
  e.motionZ = 0

  // 範囲攻撃（毎秒）
  if (e.ticksExisted % 20 === 0) {
    const range = AABB.of(e.position, 8, 4, 8)
    e.level.getEntitiesWithin(range)
      .filter(target =>
        target.isLiving() &&
        target.type !== 'kubejs:sulcon_lv1' &&
        target.type !== 'kubejs:scurpter'
      )
      .forEach(target => {
        target.attack(DamageSource.mob(e), 9)
        target.addEffect('minecraft:slowness', 60, 1)
      })

    // sonic_explosion パーティクル
    e.level.spawnParticle('minecraft:sonic_explosion', e.x, e.y + 1, e.z, 0, 0, 0, 0.1, 1)
  }

  // 周囲のscurpterにStrength I（2秒毎）
  if (e.ticksExisted % 40 === 0) {
    e.level.getEntitiesWithin(AABB.of(e.position, 8, 3, 8))
      .filter(ent => ent.type === 'kubejs:scurpter')
      .forEach(ent => ent.addEffect('minecraft:strength', 100, 0))
  }
})
StartupEvents.registry('entity_type', event => {
  event.create('sulcon_lv1')
    .category('monster')
    .fireImmune(false)
    .dimensions(0.9, 1.8)
    .trackingRange(32)
    .clientTrackingRange(64)
    .updateInterval(1)
})
