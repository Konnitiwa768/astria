// scripts/server_scripts/custom_mobs.js

// === 1. エンティティ登録 ===
StartupEvents.registry('entity_type', event => {
  event.create('starfish')
    .category('monster')
    .trackingRange(64)
    .updateInterval(3)
    .clientTrackingRange(10)
    .dimensions(['undergarden:undergarden'])
    .spawn((level, x, y, z) => level.createEntity('custom:starfish').setPosition(x, y, z))

  event.create('underrupter')
    .category('monster')
    .trackingRange(64)
    .updateInterval(2)
    .clientTrackingRange(10)
    .dimensions(['undergarden:undergarden'])
    .spawn((level, x, y, z) => level.createEntity('custom:underrupter').setPosition(x, y, z))
})

// === 2. ステータス & AI設定 ===
EntityEvents.spawned(event => {
  const entity = event.entity
  const type = entity.type

  if (type == 'custom:starfish') {
    entity.maxHealth = 40
    entity.health = 40
    entity.attackDamage = 5.5
    entity.attackSpeed = 1

    entity.addTag('custom_model')
    entity.clearGoals()
    entity.addGoal(1, 'melee_attack', { speed: 1.0, pauseWhenMobIdle: false })
    entity.addGoal(2, 'wander')
    entity.addGoal(3, 'look_at_player')
    entity.addTargetGoal(1, 'nearest_attackable_target', { entityType: 'minecraft:player' })
  }

  if (type == 'custom:underrupter') {
    entity.maxHealth = 30
    entity.health = 30
    entity.attackDamage = 4.5
    entity.attackSpeed = 1

    entity.addTag('custom_model')
    entity.clearGoals()
    entity.addGoal(1, 'melee_attack', { speed: 1.2, pauseWhenMobIdle: false })
    entity.addGoal(2, 'wander')
    entity.addGoal(3, 'look_at_player')
    entity.addTargetGoal(1, 'nearest_attackable_target', { entityType: 'minecraft:player' })
  }
})

// === 3. 特殊効果（アンダーラプターの毒攻撃） ===
MobEvents.attack(event => {
  if (event.source.entity?.type == 'custom:underrupter') {
    event.entity.addEffect('minecraft:poison', 100, 2)
  }
})

// === 4. スポーンルール ===
SpawnEvents.addSpawn(spawn => {
  spawn.entity('custom:starfish')
  spawn.biomes(['undergarden:smog_sea', 'undergarden:depths']) // 適宜変更
  spawn.chance(10)
  spawn.minCount(1).maxCount(1)
})

SpawnEvents.addSpawn(spawn => {
  spawn.entity('custom:underrupter')
  spawn.biomes('#undergarden:is_undergarden')
  spawn.chance(10)
  spawn.minCount(1).maxCount(2)
})

// === 5. ドロップテーブル設定 ===
LootJS.modifiers(event => {
  event.addEntityLoot('custom:starfish', table => {
    table.addItem('undergarden:utherium_shard').chance(1.0)
  })

  event.addEntityLoot('custom:underrupter', table => {
    table.addItem('undergarden:utherium_shard').chance(0.25)
  })
})
