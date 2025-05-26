// =============================
// 玄冥歪刃 - Genmei Wai Blade（KubeJS v6対応）
// 攻撃力15.5・速度1.75・特殊効果付きの大鎌（Spartan Weaponry）
// =============================

// レシピ登録
ServerEvents.recipes(event => {
  event.shaped('kubejs:genmei_wai_blade', [
    'NBO',
    ' N ',
    ' S '
  ], {
    O: 'minecraft:obsidian',
    N: 'minecraft:netherite_scrap',
    B: 'aoa3:baronyte_ingot',
    S: 'minecraft:stick'
  });
});

// アイテム登録
StartupEvents.registry('item', event => {
  event.create('genmei_wai_blade')
    .displayName('玄冥歪刃')
    .type('spartanweaponry:scythe')
    .tier('netherite')
    .unstackable()
    .texture('kubejs:item/genmei_wai_blade')
    .attackDamageBaseline(15.5)
    .attackSpeedBaseline(1.75);
});

// 攻撃時の効果処理
PlayerEvents.attack(event => {
  const player = event.player;
  const item = player.mainHandItem;
  if (!item || item.id != 'kubejs:genmei_wai_blade') return;

  const target = event.entity;
  if (!target) return;

  let chance = Math.random();

  if (chance < 0.30) target.addEffect('minecraft:blindness', 100, 0);  // 盲目5秒
  if (chance < 0.20) target.addEffect('minecraft:nausea', 200, 0);     // 混乱10秒
  if (chance < 0.05) {
    target.addEffect('minecraft:glowing', 60, 0);                      // 精神汚染（発光）
    player.tell(Text.of('§5[玄冥歪刃] §d精神が歪んだ気がする...'));
  }
  if (chance < 0.15) player.addEffect('minecraft:hunger', 60, 0);      // 空腹（副作用）
  player.addEffect('minecraft:regeneration', 40, 0);                   // 再生（常時）
});
