// アーマーマテリアル登録
StartupEvents.registry('armor_material', event => {
  event.create('poseidite')
    .durabilityMultiplier(39)             // ダイヤ相当の耐久性
    .slotProtections([4, 8, 6, 4])        // ヘルメット, チェスト, レギンス, ブーツの防御力
    .enchantmentValue(25)                  // エンチャント性
    .equipSound('minecraft:item.armor.equip_diamond')  // 装備時音
    .repairIngredient('minecraft:prismarine_crystals') // 修理素材
    .toughness(3.0)                       // タフネス
    .knockbackResistance(0.1)            // ノックバック耐性
})

// 防具アイテム登録
StartupEvents.registry('item', event => {
  const parts = [
    { id: 'helmet', jp: '兜', type: 'helmet' },
    { id: 'chestplate', jp: '胸当て', type: 'chestplate' },
    { id: 'leggings', jp: '脚甲', type: 'leggings' },
    { id: 'boots', jp: '靴', type: 'boots' }
  ];

  parts.forEach(part => {
    event.create(`poseidite_${part.id}`, 'armor')
      .displayName(`ポセイダイトの${part.jp}`)
      .armorType(part.type)
      .armorMaterial('poseidite')
      .texture('armors:models/armor/poseidite')
      .rarity('uncommon')
      .maxStackSize(1);
  });
})

// レシピ登録
ServerEvents.recipes(event => {
  event.shaped('armors:poseidite_helmet', [
    'PPP',
    'P P'
  ], {
    P: 'minecraft:prismarine'
  });

  event.shaped('armors:poseidite_chestplate', [
    'P P',
    'PPP',
    'PPP'
  ], {
    P: 'minecraft:prismarine'
  });

  event.shaped('armors:poseidite_leggings', [
    'PPP',
    'P P',
    'P P'
  ], {
    P: 'minecraft:prismarine'
  });

  event.shaped('armors:poseidite_boots', [
    'P P',
    'P P'
  ], {
    P: 'minecraft:prismarine'
  });
});
