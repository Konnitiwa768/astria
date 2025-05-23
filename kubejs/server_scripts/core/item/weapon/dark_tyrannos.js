// kubejs/scripts/dark_tyrannos.js

StartupEvents.registry('item', event => {
  // Dark Tyrannosの登録
  event.create('dark_tyrannos')
    .displayName('Dark Tyrannos')
    .type('sword')
    .maxDamage(1834)
    .rarity('epic')
    .attackDamageBaseline(27)
    .attackSpeedBaseline(0.84)
    .tooltip(['+50% damage vs Dustopia enemies']);

  // darkly_powderも登録（もしまだなら）
  event.create('darkly_powder')
    .displayName('Darkly Powder')
    .rarity('rare')
    .tooltip(['Material for Dark Tyrannos']);
});

ServerEvents.recipes(event => {
  // レシピ登録
  event.shaped('kubejs:dark_tyrannos', [
    ' J ',
    ' H',
    'LDL'
  ], {
    J: 'aoa3:jade',
    H: 'aoa3:harvester_sword',
    D: 'aoa3:darkly_powder',
    L: 'aoa3:lyon_ingot'
  });
});

const dustopiaEnemies = [
  'aoa3:arkzyne',
  'aoa3:basilisk',
  'aoa3:crusilisk',
  'aoa3:devourer',
  'aoa3:dusteiva',
  'aoa3:duston',
  'aoa3:dust_strider',
  'aoa3:lost_soul',
  'aoa3:lurker',
  'aoa3:merkyre',
  'aoa3:stalker'
];

EntityEvents.hurt(event => {
  const attacker = event.source.entity;
  const target = event.entity;

  if (!attacker || !attacker.mainHandItem) return;

  if (attacker.mainHandItem.id != 'kubejs:dark_tyrannos') return;

  if (dustopiaEnemies.includes(target.type.id)) {
    event.damage *= 1.5;
  }
});
