// アイテム登録
ItemEvents.register(event => {
  event.create('poison_stone')
    .displayName('ポイズンストーン')
    .rarity('rare')
    .tooltip(['§a毒を無効化'])
    .curios('charm'); // スロット名は環境に合わせて変更
});

// Curios装備時、毒効果を自動解除
PlayerEvents.tick(event => {
  const player = event.player;
  if (player.curios.has('poison_stone')) {
    if (player.potionEffects.isActive('minecraft:poison')) {
      player.potionEffects.remove('minecraft:poison');
    }
  }
});

// レシピ追加例
ServerEvents.recipes(event => {
  event.shaped('kubejs:poison_stone', [
    ' E ',
    'EGE',
    ' E '
  ], {
    E: 'minecraft:spider_eye',
    G: 'kubejs:spectrium_scrap'
  });
});
