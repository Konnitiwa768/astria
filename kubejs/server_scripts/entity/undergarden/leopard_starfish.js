// === エンティティ登録 ===
StartupEvents.registry('entity_type', event => {
  event.create('leopard_starfish')
    .category('monster')
    .trackingRange(64)
    .updateInterval(3)
    .clientTrackingRange(10)
    .dimensions(['undergarden:undergarden'])
    .spawn((level, x, y, z) => level.createEntity('custom:leopard_starfish').setPosition(x, y, z))
})

// === ステータス & AI設定 ===
EntityEvents.spawned(event => {
  const entity = event.entity
  const type = entity.type

  if (type == 'custom:leopard_starfish') {
    entity.maxHealth = 50
    entity.health = 50
    entity.attackDamage = 5
    entity.attackSpeed = 1.0

    entity.addTag('custom_model')
    entity.clearGoals()
    entity.addGoal(1, 'melee_attack', { speed: 1.0, pauseWhenMobIdle: false })
    entity.addGoal(2, 'wander')
    entity.addGoal(3, 'look_at_player')
    entity.addTargetGoal(1, 'nearest_attackable_target', { entityType: 'minecraft:player' })
  }
})

// === 効果付与（毒 + suiritai）===
MobEvents.attack(event => {
  if (event.source.entity?.type == 'custom:leopard_starfish') {
    event.entity.addEffect('minecraft:poison', 100, 0)
    event.entity.addEffect('effectplus:suiritai', 400, 0)
  }
})

// === ドロップ設定 ===
LootJS.modifiers(event => {
  event.addEntityLoot('custom:leopard_starfish', table => {
    table.addItem('undergarden:utherium_shard').chance(0.8).count([1, 3])
  })
})

// === スポーン設定（適宜 biome 調整） ===
SpawnEvents.addSpawn(spawn => {
  spawn.entity('kubejs:leopard_starfish')
  spawn.biomes(['undergarden:smog_sea', 'undergarden:depths'])
  spawn.chance(7)
  spawn.minCount(1).maxCount(1)
})

// === スポーンエッグ登録 ===
StartupEvents.registry('item', event => {
  event.create('spawn_egg_leopard_starfish')
    .displayName('Spawn Egg of Leopard Starfish')
    .texture('minecraft:item/spawn_egg')
    .properties(p => {
      p["entity"] = "kubejs:leopard_starfish"
      p["primaryColor"] = 0xc2b280 // ベージュ系
      p["secondaryColor"] = 0x5c3317 // 茶系
    })
})
