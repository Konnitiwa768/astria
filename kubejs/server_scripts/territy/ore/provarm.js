// -----------------------------------
// 1. アイテム・防具・ツール・鍛治型 登録
// -----------------------------------
StartupEvents.registry('item', event => {
  event.create('provarm_scrap').displayName('プロヴァームスクラップ')
  event.create('provarm_ingot').displayName('プロヴァームインゴット')
  event.create('provarm_smithing_template').displayName('プロヴァーム鍛治型')
})
// ツール
StartupEvents.registry('item', event => {
  event.create('provarm_pickaxe')
    .type('pickaxe')
    .tier('provarm')
    .durability(2185)
    .attackDamageBaseline(7)
    .attackSpeedBaseline(1.1)
    .miningSpeed(11.5)
    .miningLevel(7)
    .displayName('プロヴァームのつるはし')

  event.create('provarm_sword')
    .type('sword')
    .tier('provarm')
    .durability(2185)
    .attackDamageBaseline(10)
    .attackSpeedBaseline(1.6)
    .displayName('プロヴァームの剣')
})

// 鉱石ブロック
StartupEvents.registry('block', event => {
  event.create('deepslate_provarm_ore')
    .material('stone')
    .hardness(5.0)
    .displayName('深層岩プロヴァーム鉱石')
    .requiresTool(true)
    .tagBlock('minecraft:mineable/pickaxe')
    .miningLevel(6) // 採掘レベル6必要！
})

// 防具Tier
StartupEvents.registry('armor_tier', event => {
  event.create('provarm')
    .durabilityMultiplier(50)
    .enchantability(15)
    .equipSound('item.armor.equip_netherite')
    .toughness(3)
    .knockbackResistance(0.15)
    .repairIngredient('kubejs:provarm_ingot')
})

// 防具
StartupEvents.registry('item', event => {
  event.create('provarm_helmet').type('helmet').tier('provarm').armor(4).displayName('プロヴァームのヘルメット')
  event.create('provarm_chestplate').type('chestplate').tier('provarm').armor(8).displayName('プロヴァームのチェストプレート')
  event.create('provarm_leggings').type('leggings').tier('provarm').armor(7).displayName('プロヴァームのレギンス')
  event.create('provarm_boots').type('boots').tier('provarm').armor(4).displayName('プロヴァームのブーツ')
})

// -----------------------------------
// 2. 鉱石生成・ドロップ
// -----------------------------------
WorldgenEvents.add('deepslate_provarm_ore', event => {
  event.addOre(ore => {
    ore.block = 'kubejs:deepslate_provarm_ore'
    ore.size = 4
    ore.count = 2
    ore.minY = -58
    ore.maxY = -16
    ore.biomes = '#minecraft:is_overworld'
    ore.target = 'minecraft:deepslate'
  })
})

BlockEvents.broken('kubejs:deepslate_provarm_ore', event => {
  event.player.give('kubejs:provarm_scrap')
})

// -----------------------------------
// 3. クラフト・鍛治型レシピ
// -----------------------------------
ServerEvents.recipes(event => {
  // スクラップ6個→インゴット
  event.shaped('kubejs:provarm_ingot', [
    'SSS',
    'S S',
    'SSS'
  ], {
    S: 'kubejs:provarm_scrap'
  })
  // 鍛治型
  event.shaped('kubejs:provarm_smithing_template', [
    ' S ',
    'SIS',
    ' S '
  ], {
    S: 'kubejs:provarm_scrap',
    I: 'minecraft:iron_ingot'
  })
  // 防具アップグレード
  const armor = [
    ['helmet', 'demlight_helmet', 'provarm_helmet'],
    ['chestplate', 'demlight_chestplate', 'provarm_chestplate'],
    ['leggings', 'demlight_leggings', 'provarm_leggings'],
    ['boots', 'demlight_boots', 'provarm_boots']
  ]
  armor.forEach(([type, base, prov]) => {
    event.custom({
      type: 'minecraft:smithing_transform',
      template: { item: 'kubejs:provarm_smithing_template' },
      base: { item: `kubejs:${base}` },
      addition: { item: 'kubejs:provarm_ingot' },
      result: { item: `kubejs:${prov}` }
    })
  })
  // 剣・つるはしアップグレード
  event.custom({
    type: 'minecraft:smithing_transform',
    template: { item: 'kubejs:provarm_smithing_template' },
    base: { item: 'kubejs:demlight_sword' },
    addition: { item: 'kubejs:provarm_ingot' },
    result: { item: 'kubejs:provarm_sword' }
  })
  event.custom({
    type: 'minecraft:smithing_transform',
    template: { item: 'kubejs:provarm_smithing_template' },
    base: { item: 'kubejs:demlight_pickaxe' },
    addition: { item: 'kubejs:provarm_ingot' },
    result: { item: 'kubejs:provarm_pickaxe' }
  })
})

// -----------------------------------
// 4. フルセットボーナス（攻撃力上昇II）
// -----------------------------------
EntityEvents.hurt(event => {
  if (!event.entity.isPlayer()) return
  let player = event.entity
  let fullSet =
    player.getEquipment('head') == 'kubejs:provarm_helmet' &&
    player.getEquipment('chest') == 'kubejs:provarm_chestplate' &&
    player.getEquipment('legs') == 'kubejs:provarm_leggings' &&
    player.getEquipment('feet') == 'kubejs:provarm_boots'
  if (fullSet) {
    player.potionEffects.add('minecraft:strength', 60, 1, true, true) // 1=Strength II, 60tick=3秒持続（攻撃毎更新）
  }
})
