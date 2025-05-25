// Supernova Stinger - KubeJS 1.20.1 対応

// アイテム登録
ServerEvents.itemRegistry(event => {
  event.create('supernova_stinger')
    .displayName('Supernova Stinger')
    .type('sword')
    .rarity('epic')
    .unstackable()
    .attackDamage(21)
    .attackSpeed(1.35)
    .tooltip('§6両手に持つとダメージ +30%')

  event.create('cosmic_fang').displayName('Cosmic Fang')
  event.create('neutron_ingot').displayName('Neutron Ingot')
  event.create('dark_core').displayName('Dark Core')
  event.create('stinger_handle').displayName('Stinger Handle')
})

// レシピ登録
ServerEvents.recipes(event => {
  event.shaped('kubejs:supernova_stinger', [
    ' A ',
    'BCB',
    ' D '
  ], {
    A: 'aoa3:mystite_ingot',
    B: 'aoa3:baronyte_ingot',
    C: 'minecraft:netherrite_ingot',
    D: 'minecraft:stick'
  })
})

// 両手持ち判定とボーナス処理
PlayerEvents.tick(event => {
  const player = event.player
  const main = player.mainHandItem
  const off = player.offHandItem

  if (
    main.id === 'kubejs:supernova_stinger' &&
    off.id === 'kubejs:supernova_stinger'
  ) {
    player.persistentData.supernovaBonus = true
  } else {
    player.persistentData.supernovaBonus = false
  }
})

EntityEvents.hurt(event => {
  const source = event.source
  const attacker = source.entity

  if (attacker?.isPlayer()) {
    if (attacker.persistentData.supernovaBonus) {
      event.damage *= 1.3
    }
  }
})
