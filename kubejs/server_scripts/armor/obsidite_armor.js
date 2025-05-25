// Obsidite ArmorMaterial 登録
StartupEvents.registry('armor_material', event => {
  event.create('obsidite')
    .durabilityMultiplier(50)
    .slotProtections([5, 8, 6, 5]) // ヘルメット, チェスト, レギンス, ブーツ
    .enchantmentValue(20)
    .equipSound('minecraft:item.armor.equip_netherite')
    .repairIngredient('mymod:special_ingot') // 特殊インゴット
    .toughness(6.0)
    .knockbackResistance(0.2)
})

// Obsidite 防具アイテムを登録
StartupEvents.registry('item', event => {
  const parts = [
    ['helmet', '兜'],
    ['chestplate', '胸当て'],
    ['leggings', '脚甲'],
    ['boots', '靴']
  ]
  parts.forEach(([part, jp]) => {
    event.create(`obsidite_${part}`, 'armor')
      .displayName(`オブシダイトの${jp}`)
      .armorType(part)
      .armorMaterial('obsidite')
      .texture('armors:models/armor/obsidite')
      .rarity('rare')
  })
})

// レシピ登録
ServerEvents.recipes(event => {
  const S = 'aoa3:baronyte_ingot'
  const O = 'minecraft:obsidian'
  const recipes = {
    obsidite_helmet:     { base: 'armors:poseidite_helmet',     shape: ['SOS', 'SAS'] },
    obsidite_chestplate: { base: 'armors:poseidite_chestplate', shape: ['S S', 'OAO', 'SSS'] },
    obsidite_leggings:   { base: 'armors:poseidite_leggings',   shape: ['SSS', 'OAO', 'S S'] },
    obsidite_boots:      { base: 'armors:poseidite_boots',      shape: ['OAO', 'S S'] },
  }

  for (const [key, data] of Object.entries(recipes)) {
    event.shaped(`armors:${key}`, data.shape, {
      S: S,
      A: data.base
    })
  }
})

// ヘルメット効果（水中呼吸）
ItemEvents.rightClicked(event => {
  if (event.item.id == 'armors:obsidite_helmet') {
    event.player.potionEffects.add('minecraft:water_breathing', 400, 0, false, false)
  }
})

// フルセットボーナス（HPブースト II）
PlayerEvents.tick(event => {
  const player = event.player
  if (
    player.inventory.getArmor(0)?.id == 'armors:obsidite_boots' &&
    player.inventory.getArmor(1)?.id == 'armors:obsidite_leggings' &&
    player.inventory.getArmor(2)?.id == 'armors:obsidite_chestplate' &&
    player.inventory.getArmor(3)?.id == 'armors:obsidite_helmet'
  ) {
    player.potionEffects.add('minecraft:health_boost', 40, 1, false, false)
  }
})
