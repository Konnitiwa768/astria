StartupEvents.registry('entity_type', event => {
  event.create('draizer')
    .category('monster')
    .fireImmune(true)
    .health(34)
    .armor(9)
    .dimensions(1.0, 1.5)
    .trackingRange(32)
    .clientTrackingRange(64)
    .updateInterval(1)

  event.create('scane')
    .category('monster')
    .fireImmune(false)
    .health(68)
    .armor(3)
    .dimensions(1.0, 1.5)
    .trackingRange(32)
    .clientTrackingRange(64)
    .updateInterval(1)
})
let sulconKillCount = 0
let inPhase3 = false

EntityEvents.death(event => {
  const killer = event.source.entity
  if (!killer || killer.type != 'kubejs:sulcon_lv1') return

  sulconKillCount++
  if (sulconKillCount >= 125 && !inPhase3) {
    inPhase3 = true
    console.log('=== PHASE 3 移行 ===')

    const pos = killer.blockPosition()
    const level = killer.level

    // draizerスポーン
    const draizer = level.createEntity('kubejs:draizer')
    draizer.x = pos.x + 0.5
    draizer.y = pos.y
    draizer.z = pos.z + 0.5
    draizer.spawn()

    // scaneスポーン
    const scane = level.createEntity('kubejs:scane')
    scane.x = pos.x + 1.5
    scane.y = pos.y
    scane.z = pos.z + 1.5
    scane.spawn()
  }
})

EntityEvents.tick(event => {
  const e = event.entity

  // draizerの吸引攻撃
  if (e.type == 'kubejs:draizer') {
    e.motionX = 0
    e.motionY = 0
    e.motionZ = 0

    if (e.ticksExisted % 20 === 0) {
      const players = e.level.getEntitiesWithin(AABB.of(e.position, 5, 5, 5))
        .filter(ent => ent.isPlayer())

      players.forEach(player => {
        const dx = e.x - player.x
        const dy = e.y - player.y
        const dz = e.z - player.z
        const distance = Math.sqrt(dx * dx + dy * dy + dz * dz)
        const strength = 0.5

        if (distance > 0) {
          player.motionX += (dx / distance) * strength
          player.motionY += (dy / distance) * strength
          player.motionZ += (dz / distance) * strength
        }

        player.attack(DamageSource.mob(e), 7.5)
      })

      e.level.spawnParticle('minecraft:sonic_explosion', e.x, e.y + 1, e.z, 0, 0, 0, 0.1, 1)
    }
  }

  // scaneのパーティクル攻撃
  if (e.type == 'kubejs:scane') {
    e.motionX = 0
    e.motionY = 0
    e.motionZ = 0

    if (e.ticksExisted % 40 === 0) {
      const players = e.level.getEntitiesWithin(AABB.of(e.position, 6, 6, 6))
        .filter(ent => ent.isPlayer())

      players.forEach(player => {
        player.attack(DamageSource.mob(e), 4)
        player.addEffect('minecraft:slowness', 100, 3)  // 鈍化IV（level3 + 1）
        player.addEffect('minecraft:blindness', 100, 0) // 盲目
      })

      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI * 2 / 6) * i
        const px = e.x + Math.cos(angle) * 0.5
        const pz = e.z + Math.sin(angle) * 0.5
        e.level.spawnParticle('minecraft:sonic_explosion', px, e.y + 1, pz, 0, 0.05, 0, 0.01, 1)
      }
    }
  }
})
