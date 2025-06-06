// =============================
// プラズマスピア - Plasma Spear（KubeJS v6 & 独自スタン効果対応）
// ダメージ21、速度1.1667、25%で plasma_stun を付与
// =============================

// アイテム登録
StartupEvents.registry('item', event => {
  event.create('plasma_spear')
    .displayName('Plasma Spear')
    .type('spartanweaponry:spear') // 必要に応じてtypeは調整
    .tier('netherite')
    .unstackable()
    .texture('kubejs:item/plasma_spear')
    .attackDamageBaseline(21)
    .attackSpeedBaseline(1.1667)
    .rarity('rare');
});

// レシピ登録（例）
ServerEvents.recipes(event => {
  event.shaped('kubejs:plasma_spear', [
    ' PE',
    'SP ',
    ' S '
  ], {
    P: 'aoa3:elecanite_ingot',
    E: 'aoa3:power_rune',
    S: 'aob3:storm_rune'
  });
});

// 25%で plasma_stun エフェクト付与
PlayerEvents.attack(event => {
  const player = event.player;
  const item = player.mainHandItem;
  if (!item || item.id != 'kubejs:plasma_spear') return;
  const target = event.entity;
  if (!target) return;

  if (Math.random() < 0.25) {
    target.addEffect('effectplus:plasma_stun', 60, 0); // 3秒スタン
    player.tell(Text.of('§b[Plasma Spear] 相手をスタンさせた！'));
  }
});
