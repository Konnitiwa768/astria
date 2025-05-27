// =============================
// ブラッドランス - Blood Lance（KubeJS v6, Spartan Weaponry, Apotheosis）
// ダメージ24.5、速度1.0667、攻撃時に出血エフェクト（例:kubejs:blood_bleed）付与
// =============================

// アイテム登録
StartupEvents.registry('item', event => {
  event.create('blood_lance')
    .displayName('Blood Lance')
    .type('spartanweaponry:lance') // Spartan Weaponryのlanceタイプ
    .tier('netherite')
    .unstackable()
    .texture('kubejs:item/blood_lance')
    .attackDamageBaseline(24.5)
    .attackSpeedBaseline(1.0667)
    .rarity('epic');
});

// レシピ登録（例）
ServerEvents.recipes(event => {
  event.shaped('kubejs:blood_lance', [
    ' RL',
    'SR ',
    ' S '
  ], {
    R: 'aoa3:bloodstone',
    L: 'minecraft:lapis_block',
    S: 'minecraft:stick'
  });
});

// 攻撃時に出血効果付与（常時）
PlayerEvents.attack(event => {
  const player = event.player;
  const item = player.mainHandItem;
  if (!item || item.id != 'kubejs:blood_lance') return;
  const target = event.entity;
  if (!target) return;

  target.addEffect('kubejs:bleeding', 100, 0); // 5秒間出血（tick換算）、IDはapotheosisのJSONで定義したもの
  player.tell(Text.of('§c[Blood Lance] 出血させた！'));
});
