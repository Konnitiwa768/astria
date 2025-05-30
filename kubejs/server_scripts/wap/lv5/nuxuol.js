// ----------------------------
// noxuol 登録
// ----------------------------
StartupEvents.registry('entity_type', event => {
  event.create('noxuol')
    .entityClass('monster')
    .size(0.9, 1.8)
    .trackingRange(32)
    .updateInterval(3)
    .defaultAttributes(a => {
      a.maxHealth = 88
      a.movementSpeed = 0.3
      a.attackDamage = 10
      a.followRange = 32
    })
    .spawnEgg('3c0033', '8a00cc')
})

// ----------------------------
// AI 設定
// ----------------------------
EntityEvents.addAI(event => {
  const e = event.entity
  if (e.type !== 'kubejs:noxuol') return

  e.goalSelectors.add(0, 'minecraft:melee_attack', {
    speed: 1.0,
    pauseWhenMobIdle: false
  })

  e.goalSelectors.add(1, 'minecraft:look_at', {
    entity_type: 'minecraft:player',
    range: 8.0
  })

  e.goalSelectors.add(2, 'minecraft:look_randomly', {})

  e.targetSelectors.add(0, 'minecraft:hurt_by_target', {})
  e.targetSelectors.add(1, 'minecraft:nearest_attackable_target', {
    predicate: 'minecraft:player'
  })
})

// ----------------------------
// 状態管理
// ----------------------------
let scultoxicKillCount = 0
let phase5Triggered = false

// ----------------------------
// scultoxic 50体討伐カウント
// ----------------------------
EntityEvents.death(event => {
  if (event.entity.type === 'kubejs:scultoxic') {
    scultoxicKillCount++
    console.log(`[Phase5] scultoxic討伐数: ${scultoxicKillCount}`)
  }
})

// ----------------------------
// Phase5発動＆プレイヤー近くにスポーン制御
// ----------------------------
ServerEvents.tick(event => {
  if (!phase5Triggered && scultoxicKillCount >= 50) {
    phase5Triggered = true
    console.log('[Phase5] 発動：scultoxic 50体撃破達成')
  }

  if (phase5Triggered && event.server.tickCount % 600 === 0) { // 30秒ごと
    const level = event.server.levels[0]
    level.players.forEach(player => {
      const pos = player.blockPosition().offset(rand(-3, 3), 0, rand(-3, 3))
      level.spawnEntity('kubejs:kyrphos', pos)
      level.spawnEntity('kubejs:sentry', pos)
      level.spawnEntity('kubejs:noxuol', pos)
    })
  }
})

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// ----------------------------
// 自然スポーンルールの追加
// Phase5が発動していなければスポーン不可
// 対象はkyrphos, sentry, noxuolの3種
// ----------------------------
SpawnEvents.canSpawn(event => {
  const entity = event.entity
  if (
    entity.type === 'kubejs:noxuol' ||
    entity.type === 'kubejs:kyrphos' ||
    entity.type === 'kubejs:sentry'
  ) {
    if (!phase5Triggered) {
      event.setResult(false) // Phase5未発動ならスポーン禁止
      return
    }
    // Phase5発動後は通常スポーン判定に任せる
  }
})

// ----------------------------
// spawn時処理: noxuolは浮遊、kyrphos/sentryはバフ付与
// ----------------------------
EntityEvents.spawned(event => {
  const e = event.entity
  const type = e.type

  if (type === 'kubejs:noxuol') {
    e.setNoGravity(true)
  }

  if (type === 'kubejs:kyrphos' || type === 'kubejs:sentry') {
    e.potionEffects.add('minecraft:regeneration', 6000, 2) // 再生III
    e.potionEffects.add('minecraft:strength', 6000, 1)     // 力II
    e.potionEffects.add('minecraft:resistance', 6000, 0)   // 耐性I
  }
})

// ----------------------------
// noxuol攻撃時の特殊効果：衰弱・空腹 + kyrphos引き寄せ
// ----------------------------
EntityEvents.hurt(event => {
  const attacker = event.source.entity
  const target = event.entity

  if (attacker?.type === 'kubejs:noxuol' && target.isLiving()) {
    target.potionEffects.add('minecraft:weakness', 200, 0) // 衰弱I（10秒）
    target.potionEffects.add('minecraft:hunger', 200, 1)   // 空腹II（10秒）

    const level = target.level
    level.getEntitiesWithin('kubejs:kyrphos', target.position, 16).forEach(kyr => {
      kyr.teleportTo(target.x, target.y, target.z)
    })
  }
})
