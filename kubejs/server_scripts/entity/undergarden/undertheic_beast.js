// === 1. エンティティ登録 ===
StartupEvents.registry('entity_type', event => {
  event.create('undertheic_beast')
    .category('monster')
    .trackingRange(64)
    .updateInterval(2)
    .clientTrackingRange(10)
    .dimensions(['undergarden:undergarden'])
    .spawn((level, x, y, z) => level.createEntity('custom :undertheic_beast').setPosition(x, y, z))
})

// === 2. ステータス & AI設定 ===
EntityEvents.spawned(event => {
  const entity = event.entity
  const type = entity.type

  if (type == 'custom :undertheic_beast') {
    entity.maxHealth = 65
    entity.health = 65
    entity.attackDamage = 7
    entity.attackSpeed = 0.8

    entity.addTag('custom_model')
    entity.clearGoals()
    entity.addGoal(1, 'melee_attack', { speed: 0.8, pauseWhenMobIdle: false })
    entity.addGoal(2, 'wander')
    entity.addGoal(3, 'look_at_player')
    entity.addTargetGoal(1, 'nearest_attackable_target', { entityType: 'minecraft:player' })
  }
})

// === 3. ドロップ設定 ===
LootJS.modifiers(event => {
  event.addEntityLoot('custom:undertheic_beast', table => {
    table.addItem('minecraft:diamond').chance(0.2)
    table.addItem('minecraft:gold_ingot').chance(0.5)
    table.addItem('undergarden:utherium_shard').chance(0.8)
  })
})

// === 4. スポーン設定 ===
SpawnEvents.addSpawn(spawn => {
  spawn.entity('custom:undertheic_beast')
  spawn.biomes(['undergarden:forgotten_fields', 'undergarden:depths'])
  spawn.chance(5)
  spawn.minCount(1).maxCount(1)
})

// === 5. スポーンエッグ（色付き） ===
StartupEvents.registry('item', event => {
  event.create('spawn_egg_undertheic_beast')
    .displayName('Spawn Egg of Undertheic Beast')
    .texture('minecraft:item/spawn_egg')
    .properties(p => {
      p["entity"] = "custom:undertheic_beast"
      p["primaryColor"] = 0x1c1c1c // 黒
      p["secondaryColor"] = 0x4a005f // 暗紫色
    })
})
