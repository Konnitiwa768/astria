// レシピ登録
ServerEvents.recipes(event => {
  event.shaped('kubejs:utherium_rifle', [
    'UGU',
    'UGU'
  ], {
    U: 'undergarden:utherium_crystal',
    G: 'minecraft:gunpowder'
  });
});

// アイテム登録
StartupEvents.registry('item', event => {
  event.create('utherium_rifle')
    .displayName('Utherium Rifle')
    .maxStackSize(1)
    .group('combat')
    .texture('kubejs:item/utherium_rifle')
    .properties(p => p.maxDamage(40)); // 弾数管理
});

const RELOAD_ITEMS = {
  gunpowder: 'minecraft:gunpowder',
  utherium_shard: 'undergarden:utherium_shard'
};

const RELOAD_COST = {
  gunpowder: 5,
  utherium_shard: 5
};

const DAMAGE = 7;
const ATTACK_SPEED = 7.2;

// 発射処理
ItemEvents.rightClick(event => {
  const item = event.item;
  const player = event.player;

  if (item.id !== 'kubejs:utherium_rifle') return;

  event.cancel();

  let ammo = item.getDamage();

  if (ammo >= 40) {
    player.tell('弾がありません。リロードしてください。');
    return;
  }

  ammo++;
  item.setDamage(ammo);

  player.level.playSound(null, player.x, player.y, player.z, 'minecraft:entity.arrow.shoot', 'player', 1.0, 0.8);

  const rayTrace = player.level.rayTrace(player, 5, false);

  if (rayTrace && rayTrace.entity) {
    let target = rayTrace.entity;
    if (target.hurtTime > 0) target.hurtTime = 0;
    target.damage(DAMAGE, player);
    target.addEffect('minecraft:slowness', 100, 5); // 5秒間鈍化VI（レベル5）
  }

  // リコイル（視点を4度上へ）
  player.setPitch(player.pitch - 4);

  if (ammo >= 40) {
    player.tell('弾が切れました。リロードしてください。');
  }
});

// リロード処理（スニーク右クリック）
ItemEvents.useItem(event => {
  const item = event.item;
  const player = event.player;

  if (item.id !== 'kubejs:utherium_rifle') return;
  if (!player.isSneaking()) return;

  let inv = player.inventory;
  let hasGunpowder = inv.count(RELOAD_ITEMS.gunpowder) >= RELOAD_COST.gunpowder;
  let hasShard = inv.count(RELOAD_ITEMS.utherium_shard) >= RELOAD_COST.utherium_shard;

  if (!hasGunpowder || !hasShard) {
    player.tell('リロードに必要な素材が足りません。');
    return;
  }

  inv.remove(RELOAD_ITEMS.gunpowder, RELOAD_COST.gunpowder);
  inv.remove(RELOAD_ITEMS.utherium_shard, RELOAD_COST.utherium_shard);

  item.setDamage(0);
  player.tell('リロード完了！弾が満タンになりました。');
});
