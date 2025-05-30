// -----------------------------------
// 1. アイテム・防具・ツール・鍛治型 登録
// -----------------------------------
StartupEvents.registry('item', event => {
  event.create('demlight_scrap').displayName('デムライトスクラップ')
  event.create('demlight_ingot').displayName('デムライトインゴット')
  event.create('demlight_smithing_template').displayName('デムライト鍛治型')
  // ツール
  StartupEvents.registry('item', event => {
  event.create('demlight_pickaxe')
    .type('pickaxe')
    .tier('netherrite')
    .durability(2100)
    .attackDamageBaseline(6)
    .attackSpeedBaseline(1.2)
    .miningSpeed(10)         // 掘削速度
    .miningLevel(5)          // 採掘レベル（ネザライトより上の場合は4等に）
    .displayName('デムライトのつるはし')

  event.create('demlight_sword')
    .type('sword')
    .tier('netherrite')
    .durability(2100)
    .attackDamageBaseline(9)
    .attackSpeedBaseline(1.6)
    .displayName('デムライトの剣')
})

StartupEvents.registry('block', event => {
  event.create('deepslate_demlight_ore')
    .material('stone')
    .hardness(4.5)
    .displayName('深層岩デムライト鉱石')
    .requiresTool(true)
    .tagBlock('minecraft:mineable/pickaxe')
})

// 防具Tier
StartupEvents.registry('armor_tier', event => {
  event.create('demlight')
    .durabilityMultiplier(46)
    .enchantability(13)
    .equipSound('item.armor.equip_netherite')
    .toughness(2)
    .knockbackResistance(0.1)
    .repairIngredient('kubejs:demlight_ingot')
})

// 防具
StartupEvents.registry('item', event => {
  event.create('demlight_helmet').type('helmet').tier('demlight').armor(4).displayName('デムライトのヘルメット')
  event.create('demlight_chestplate').type('chestplate').tier('demlight').armor(8).displayName('デムライトのチェストプレート')
  event.create('demlight_leggings').type('leggings').tier('demlight').armor(6).displayName('デムライトのレギンス')
  event.create('demlight_boots').type('boots').tier('demlight').armor(4).displayName('デムライトのブーツ')
})

// -----------------------------------
// 2. 鉱石生成・ドロップ
// -----------------------------------
WorldgenEvents.add('deepslate_demlight_ore', event => {
  event.addOre(ore => {
    ore.block = 'kubejs:deepslate_demlight_ore'
    ore.size = 5
    ore.count = 2
    ore.minY = -64
    ore.maxY = -16
    ore.biomes = '#minecraft:is_overworld'
    ore.target = 'minecraft:deepslate'
  })
})

BlockEvents.broken('kubejs:deepslate_demlight_ore', event => {
  event.player.give('kubejs:demlight_scrap')
})

// -----------------------------------
// 3. クラフト・鍛治型レシピ
// -----------------------------------
ServerEvents.recipes(event => {
  // スクラップ6個→インゴット
  event.shaped('kubejs:demlight_ingot', [
    'SSS ',
    'S S',
    'SSS'
  ], {
    S: 'kubejs:demlight_scrap'
  })
  // 鍛治型
  event.shaped('kubejs:demlight_smithing_template', [
    ' S ',
    'SIS',
    ' S '
  ], {
    S: 'kubejs:demlight_scrap',
    I: 'minecraft:iron_ingot'
  })
  // 防具アップグレード
  const armor = [
    ['helmet', 'netherrite_helmet', 'demlight_helmet'],
    ['chestplate', 'netherrite_chestplate', 'demlight_chestplate'],
    ['leggings', 'netherrite_leggings', 'demlight_leggings'],
    ['boots', 'netherrite_boots', 'demlight_boots']
  ]
  armor.forEach(([type, diamond, demlight]) => {
    event.custom({
      type: 'minecraft:smithing_transform',
      template: { item: 'kubejs:demlight_smithing_template' },
      base: { item: `minecraft:${diamond}` },
      addition: { item: 'kubejs:demlight_ingot' },
      result: { item: `kubejs:${demlight}` }
    })
  })
  // 剣・つるはしアップグレード
  event.custom({
    type: 'minecraft:smithing_transform',
    template: { item: 'kubejs:demlight_smithing_template' },
    base: { item: 'minecraft:netherrite_sword' },
    addition: { item: 'kubejs:demlight_ingot' },
    result: { item: 'kubejs:demlight_sword' }
  })
  event.custom({
    type: 'minecraft:smithing_transform',
    template: { item: 'kubejs:demlight_smithing_template' },
    base: { item: 'minecraft:netherrite_pickaxe' },
    addition: { item: 'kubejs:demlight_ingot' },
    result: { item: 'kubejs:demlight_pickaxe' }
  })
})

// -----------------------------------
// 4. 遠距離ダメージ50%カット（全身装備時）
// -----------------------------------
EntityEvents.hurt(event => {
  if (!event.entity.isPlayer()) return
  let player = event.entity
  if (event.source.isProjectile()) {
    let fullSet =
      player.getEquipment('head') == 'kubejs:demlight_helmet' &&
      player.getEquipment('chest') == 'kubejs:demlight_chestplate' &&
      player.getEquipment('legs') == 'kubejs:demlight_leggings' &&
      player.getEquipment('feet') == 'kubejs:demlight_boots'
    if (fullSet)
      event.damage = event.damage * 0.5
  }
})
