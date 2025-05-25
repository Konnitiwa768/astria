ServerEvents.itemRegistry(event => {
  event.create('amethyst_halberd')
    .displayName('§5紫晶戟')
    .type('sword')
    .attackDamageBaseline(17)
    .attackSpeedBaseline(1.34)
    .maxDamage(1561);
});

EntityEvents.hurt(event => {
  const attacker = event.source.entity;
  if (!attacker || !attacker.mainHandItem) return;
  if (attacker.mainHandItem.id !== 'kubejs:amethyst_halberd') return;

  if (Math.random() < 0.4) {
    event.damage *= 2;
    if (attacker.tell) attacker.tell(Text.of('§d戟的効果已发动！'));
  }
});
