// =============================
// マジカルソウル - Magical Soul（KubeJS v6対応）
// ダメージ20、速度1、攻撃時に自身が回復
// =============================

// アイテム登録
StartupEvents.registry('item', event => {
  event.create('magical_soul')
    .displayName('Magical Soul')
    .type('spartanweaponry:spear') // Spartan Weaponryのswordタイプ
    .tier('netherite')
    .unstackable()
    .texture('kubejs:item/magical_soul')
    .attackDamageBaseline(20)
    .attackSpeedBaseline(1)
    .rarity('rare');
});

// レシピ登録（例）
ServerEvents.recipes(event => {
  event.shaped('kubejs:magical_soul', [
    ' G ',
    ' GN',
    ' N '
  ], {
    G: 'aoa3:ghoulasm',
    N: 'minecraft:netherrack'
  });
});

// 攻撃時に自身を回復
PlayerEvents.attack(event => {
  const player = event.player;
  const item = player.mainHandItem;
  if (!item || item.id != 'kubejs:magical_soul') return;

  // 自分を回復（回復量：2 = 1ハート分。調整可）
  player.heal(2);
  player.tell(Text.of('§d[Magical Soul] あなたは癒された！'));
});
