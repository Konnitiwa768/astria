ServerEvents.itemRegistry(event => {
  event.create('crystavite')
    .type('sword')
    .displayName('Crystavite')
    .maxDamage(2048)
    .rarity('epic')
    .attackDamageBaseline(28)
    .attackSpeedBaseline(0.6);
});

ServerEvents.recipes(event => {
  event.shaped('kubejs:crystavite', [
    ' C ',
    ' D ',
    ' N '
  ], {
    C: 'minecraft:amethyst_shard',
    D: 'minecraft:diamond',
    N: 'minecraft:netherite_sword',
  });
});

const hitCounts = {};

EntityEvents.hurt(event => {
  const player = event.source.entity;
  const target = event.entity;

  if (!player || !player.mainHandItem) return;
  if (player.mainHandItem.id != 'kubejs:crystavite') return;

  const id = player.uuid;
  const now = Date.now();

  if (!hitCounts[id]) {
    hitCounts[id] = { count: 1, lastHit: now };
  } else {
    const timeDiff = now - hitCounts[id].lastHit;
    if (timeDiff < 2000) {
      hitCounts[id].count++;
    } else {
      hitCounts[id].count = 1;
    }
    hitCounts[id].lastHit = now;
  }

  const bonus = Math.min(hitCounts[id].count - 2, 14);
  event.damage = 28 + bonus;
});
