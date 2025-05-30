// ========== Entity 登録 ==========
StartupEvents.registry('entity_type', event => {
  event.create('feral_scurpter')
    .category('monster')
    .size(0.6, 1.95)
    .trackingRange(64)
    .updateInterval(2)
    .clientTrackingRange(8)
    .egg(0x222222, 0x882222) // 黒x赤の卵
})

// ========== Lang登録 ==========
ClientEvents.lang('ja_jp', e => {
  e.add('entity.kubejs.feral_scurpter', 'フェラルスカルプター')
})

// ========== スポーン条件管理（Phase6） ==========
let scurpterTargets = ['scultoxic', 'scurpter', 'draizer', 'scane']
global.phase6_kills = 0
global.phase6_deaths = 0
global.phase6_unlocked = false

EntityEvents.death(e => {
  let killer = e.source?.entity
  if (!killer) return

  if (scurpterTargets.includes(e.entity.type.getPath()) && killer.isPlayer()) {
    global.phase6_kills++
  }

  if (e.entity.type.getPath() === 'minecraft:player' && killer && scurpterTargets.includes(killer.type.getPath())) {
    global.phase6_deaths++
  }

  if (!global.phase6_unlocked && (global.phase6_kills >= 55 || global.phase6_deaths >= 30)) {
    global.phase6_unlocked = true
    e.server.runCommandSilent('tellraw @a {"text":"[Phase 6] has begun...","color":"dark_red"}')
  }
})

// ========== ワールド生成スポーン設定 ==========
WorldgenEvents.add(event => {
  event.addSpawns(spawn => {
    spawn.inBiome("minecraft:end")
      .addEntity("kubejs:feral_scurpter", setting => {
        setting.weight(20).groupCount(1, 2)
      })
  })
})

// ========== Phase6 以前は自然スポーン無効 ==========
SpawnEvents.spawnEntity(event => {
  if (event.entity.type != 'kubejs:feral_scurpter') return
  if (!global.phase6_unlocked) event.cancel()
})

// ========== モブ生成時：ステータス初期化とAI登録 ==========
EntityEvents.spawned(event => {
  if (event.entity.type != 'kubejs:feral_scurpter') return
  let e = event.entity
  e.maxHealth = 55
  e.health = 55
  e.attackDamage = 7
  e.persistent = true
  e.customName = Text.of('Feral Scurpter')
  e.persistentData.timer = 0

  const goal = e.goalSelector
  const target = e.targetSelector

  goal.add(0, 'minecraft:float')
  goal.add(1, 'minecraft:melee_attack', { speed: 1.1, pauseWhenMobIdle: false })
  goal.add(2, 'minecraft:random_stroll', { speed: 0.8 })
  goal.add(3, 'minecraft:look_at_player', { maxDistance: 8.0 })
  goal.add(4, 'minecraft:look_randomly')

  target.add(1, 'minecraft:hurt_by_target')
  target.add(2, 'minecraft:nearest_attackable_target', { entityType: 'minecraft:player' })
})

// ========== 毎tick処理：特殊能力 & 簡易追跡 ==========
EntityEvents.tick(event => {
  let e = event.entity
  if (e.type != 'kubejs:feral_scurpter') return
  let pd = e.persistentData

  // 背後テレポ攻撃：10秒ごと
  pd.timer = (pd.timer || 0) + 1
  if (pd.timer >= 200) {
    let players = e.level.getPlayers().filter(p => p.distanceTo(e) < 16)
    if (players.length > 0) {
      let target = players.sort((a, b) => a.distanceTo(e) - b.distanceTo(e))[0]
      let yaw = target.rotation.y + 180
      let rad = yaw / 180 * Math.PI
      let dx = -Math.sin(rad)
      let dz = Math.cos(rad)
      e.teleportTo(target.x + dx, target.y, target.z + dz)
      e.swing('main_hand')
      e.attack(target)
    }
    pd.timer = 0
  }

  // 簡易追跡AI（ターゲットが外れた時の保険）
  if (!e.target || !e.target.isPlayer()) {
    let nearest = e.level.getPlayers().filter(p => p.distanceTo(e) < 16)[0]
    if (nearest) e.target = nearest
  }
})

// ========== 攻撃された時：5%の確率で武器を落とさせる ==========
EntityEvents.hurt(event => {
  if (event.entity.type != 'kubejs:feral_scurpter') return
  let attacker = event.source?.entity
  if (!attacker || !attacker.mainHandItem) return

  if (Math.random() < 0.05) {
    let item = attacker.mainHandItem
    attacker.mainHandItem = Item.empty
    attacker.level.spawnItem(item, attacker.x, attacker.y + 1, attacker.z)
    attacker.tell(Text.red("Your weapon was knocked away!"))
  }
})
