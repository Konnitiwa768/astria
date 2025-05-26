// Neonlaser Beam - KubeJS 1.20.1 用

// アイテム定義
ServerEvents.itemRegistry(event => {
  event.create('neonlaser_beam')
    .displayName('Neonlaser Beam')
    .type('sword')
    .rarity('epic')
    .unstackable()
    .attackDamage(22)
    .attackSpeed(1.2)
    .tooltip('§b攻撃対象を1秒間光らせる')
    .tooltip('§7ダメージ: 22 | 速度: 1.2')
})

// レシピ
ServerEvents.recipes(event => {
  event.shaped('kubejs:neonlaser_beam', [
    ' AA',
    'BA ',
    'CB '
  ], {
    A: 'aoa3:goulish_ingot',
    B: 'aoa3:blue_gemstone',
    C: 'minecraft:stick'
  })
})

// 特殊素材（別スクリプトに分けてもOK）
ServerEvents.itemRegistry(event => {
  event.create('neon_crystal').displayName('Neon Crystal')
  event.create('laser_core').displayName('Laser Core')
  event.create('beam_handle').displayName('Beam Handle')
})

// 攻撃時：対象に発光エフェクトを付与（1秒）
EntityEvents.hurt(event => {
  const source = event.source
  const attacker = source.entity
  const target = event.entity

  if (attacker?.isPlayer()) {
    const weapon = attacker.mainHandItem
    if (weapon.id === 'kubejs:neonlaser_beam') {
      target.potionEffects.add('minecraft:glowing', 20, 0) // 20tick = 1秒
    }
  }
})
