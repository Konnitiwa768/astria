// 例: KubeJS v6 + KubeJS-Curios用
// アイテム登録
ItemEvents.register(event => {
  event.create('flame_heart')
    .displayName('炎のハート')
    .rarity('rare')
    .tooltip(['§c体力+6', '§6火炎耐性'])
    .curios('charm'); // curiosスロット名に合わせて変更
});

// Curios装備時の効果付与
PlayerEvents.tick(event => {
  const player = event.player;
  if (player.curios.has('flame_heart')) {
    // 体力最大値+6（3ハート分）
    player.attribute('minecraft:generic.max_health').addModifier('flame_heart_bonus', 6, 'addition');
    // 火炎耐性（Fire Resistance 1を常時付与）
    player.potionEffects.add('minecraft:fire_resistance', 220, 0, true, false);
  } else {
    player.attribute('minecraft:generic.max_health').removeModifier('flame_heart_bonus');
  }
});

// レシピ追加例
ServerEvents.recipes(event => {
  event.shaped('kubejs:flame_heart', [
    ' F ',
    'FNF',
    ' F '
  ], {
    F: 'kubejs:provarm_scrap',
    N: 'scalinghealth:heart_crystal'
  });
});
