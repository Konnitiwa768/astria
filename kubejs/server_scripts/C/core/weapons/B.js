// Supernova Stinger - 定義 + レシピ + ボーナス処理

onEvent('item.registry', event => {
  // 武器本体
  event.create('supernova_stinger')
    .type('sword')
    .displayName('Supernova Stinger')
    .attackDamageBaseline(21)
    .attackSpeed(1.35)
    .rarity('epic')
    .tooltip('§6両手に持つとダメージ +30%')

  // 素材アイテム
  event.create('cosmic_fang').displayName('Cosmic Fang')
  event.create('neutron_ingot').displayName('Neutron Ingot')
  event.create('dark_core').displayName('Dark Core')
  event.create('stinger_handle').displayName('Stinger Handle')
})

onEvent('recipes', event => {
  event.shaped('kubejs:supernova_stinger', [
    ' A ',
    'BCB',
    ' D '
  ], {
    A: 'aoa3:purple_gemstone',
    B: 'aoa3:mystite_ingot',
    C: 'minecraft:netherrite_ingot',
    D: 'minecraft:stick'
  })
})

// 両手持ちチェック（毎tick更新）
onEvent('player.tick', event => {
  let player = event.player
  let main = player.mainHandItem
  let off = player.offHandItem

  if (main.id == 'kubejs:supernova_stinger' && off.id == 'kubejs:supernova_stinger') {
    player.persistentData.supernova_bonus = true
  } else {
    player.persistentData.supernova_bonus = false
  }
})

// ボーナスダメージ適用
onEvent('entity.damage', event => {
  let source = event.source.entity
  if (source && source.isPlayer()) {
    if (source.persistentData.supernova_bonus) {
      event.damage = event.damage * 1.3
    }
  }
})
