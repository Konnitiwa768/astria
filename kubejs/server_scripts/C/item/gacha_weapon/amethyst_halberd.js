// kubejs/server_scripts/weapons/amethyst_halberd.js
onEvent('item.registry', event => {
  event.create('amethyst_halberd')
    .displayName('§5紫晶戟')
    .type('sword') // 実際はカスタムモデルで戟に見せる
    .attackDamageBaseline(17)
    .attackSpeedBaseline(1.34)
    .maxDamage(1561)
})

// kubejs/server_scripts/effects/amethyst_halberd_effect.js
onEvent('entity.attack', event => {
  let attacker = event.source.entity
  let weapon = attacker.getHeldItemMainhand()

  if (weapon.id == 'kubejs:amethyst_halberd') {
    if (Math.random() < 0.4) {
      event.damage *= 2
      attacker.tell(Text.of('§d戟的效果已发动！'))
    }
  }
})
