StartupEvents.registry('item', event => {
  event.create('lightning_stinger')
    .type('sword')
    .tier('netherite')
    .attackDamageBaseline(18)
    .attackSpeedBaseline(1.42)
    .displayName('Lightning Stinger')
    .tooltip('Strikes with a stunning force')
})

ServerEvents.recipes(event => {
  event.shaped('kubejs:lightning_stinger', [
    ' G ',
    'INI',
    ' I '
  ], {
    G: 'minecraft:gunpowder',
    I: 'minecraft:iron_ingot',
    N: 'minecraft:nether_star'
  })
})

EntityEvents.hurt(event => {
  let attacker = event.source.actual
  let target = event.entity

  if (!attacker || !attacker.mainHandItem?.id?.equals('kubejs:lightning_stinger')) return
  if (!target.isLiving()) return

  // スタン効果：スロー＆採掘速度低下（3秒間）、レベル255
  target.potionEffects.add('minecraft:slowness', 60, 255)
  target.potionEffects.add('minecraft:mining_fatigue', 60, 255)
})
