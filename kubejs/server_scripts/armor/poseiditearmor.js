// ポセイダイトアーマーを登録・レシピ追加
StartupEvents.registry('item', event => {
  const parts = ['helmet', 'chestplate', 'leggings', 'boots']
  parts.forEach(part => {
    event.create(`poseidite_${part}`)
      .displayName(`ポセイダイトの${translate(part)}`)
      .maxStackSize(1)
      .rarity('uncommon')
  })
})

ServerEvents.recipes(event => {
  event.shaped('armors:poseidite_helmet', [
    'PPP',
    'P P'
  ], {
    P: 'minecraft:prismarine'
  })

  event.shaped('armors:poseidite_chestplate', [
    'P P',
    'PPP',
    'PPP'
  ], {
    P: 'minecraft:prismarine'
  })

  event.shaped('armors:poseidite_leggings', [
    'PPP',
    'P P',
    'P P'
  ], {
    P: 'minecraft:prismarine'
  })

  event.shaped('armors:poseidite_boots', [
    'P P',
    'P P'
  ], {
    P: 'minecraft:prismarine'
  })
})

function translate(part) {
  switch (part) {
    case 'helmet': return '兜'
    case 'chestplate': return '胸当て'
    case 'leggings': return '脚甲'
    cas// アーマーマテリアルを定義
StartupEvents.registry('armor_material', event => {
  event.create('poseidite')
    .durabilityMultiplier(39) // ダイヤモンド相当
    .slotProtections([4, 8, 6, 4]) // ヘルメット, チェスト, レギンス, ブーツ
    .enchantmentValue(25) // エンチャント性（高め）
    .equipSound('minecraft:item.armor.equip_diamond')
    .repairIngredient('minecraft:prismarine_crystals')
    .toughness(3.0) // タフネス（ネザライト相当）
    .knockbackResistance(0.1) // 軽いノックバック耐性
})

// 防具アイテムを登録
StartupEvents.registry('item', event => {
  event.create('poseidite_helmet', 'armor')
    .displayName('ポセイダイトの兜')
    .armorType('helmet')
    .armorMaterial('poseidite')
    .texture('armors:models/armor/poseidite')
    .rarity('uncommon')

  event.create('poseidite_chestplate', 'armor')
    .displayName('ポセイダイトの胸当て')
    .armorType('chestplate')
    .armorMaterial('poseidite')
    .texture('armors:models/armor/poseidite')
    .rarity('uncommon')

  event.create('poseidite_leggings', 'armor')
    .displayName('ポセイダイトの脚甲')
    .armorType('leggings')
    .armorMaterial('poseidite')
    .texture('armors:models/armor/poseidite')
    .rarity('uncommon')

  event.create('poseidite_boots', 'armor')
    .displayName('ポセイダイトの靴')
    .armorType('boots')
    .armorMaterial('poseidite')
    .texture('armors:models/armor/poseidite')
    .rarity('uncommon')
})
