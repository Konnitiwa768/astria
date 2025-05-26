// =============================
// Dark Tyrannos（KubeJS v6対応）
// =============================

// アイテム登録
StartupEvents.registry('item', event => {
  event.create('dark_tyrannos')
    .displayName('Dark Tyrannos')
    .type('sword')
    .maxDamage(1834)
    .rarity('epic')
    .attackDamageBaseline(27)
    .attackSpeedBaseline(0.84)
    .tooltip(['+50% damage vs Dustopia enemies']);
});

// レシピ登録
ServerEvents.recipes(event => {
  event.shaped('kubejs:dark_tyrannos', [
    ' J ',
    ' H',
    'LDL'
  ], {
    J: 'aoa3:jade',
    H: 'aoa3:harvester_sword',
    D: 'aoa3:darklity_powder',
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

// ダメージ増加イベント（v6仕様）
EntityEvents.hurt(event => {
  const attacker = event.source.entity;
  const target = event.entity;

  if (!attacker || !attacker.mainHandItem) return;
  if (attacker.mainHandItem.id != 'kubejs:dark_tyrannos') return;

  if (dustopiaEnemies.includes(target.type.id)) {
    event.damage *= 1.5;
  }
});
