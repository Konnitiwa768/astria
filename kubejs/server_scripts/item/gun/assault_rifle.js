// レシピ登録
onEvent('recipes', event => {
  event.shaped('kubejs:assault_rifle', [
    'NGI',
    'IGI'
  ], {
    I: 'minecraft:iron_ingot',
    G: 'minecraft:gunpowder',
    N: 'minecraft:netherite_ingot'
  });
});

// アイテム登録
onEvent('item.registry', event => {
  event.create('assault_rifle')
    .displayName('Assault Rifle')
    .maxStackSize(1)
    .maxDamage(40)
    .group('combat')
    .texture('kubejs:item/assault_rifle');
});

const RELOAD_ITEMS = {
  gunpowder: 'minecraft:gunpowder',
  iron_ingot: 'minecraft:iron_ingot'
};

const RELOAD_COST = {
  gunpowder: 5,
  iron_ingot: 5
};

const DAMAGE = 8;

// 発射処理
onEvent('player.right_click', event => {
  const player = event.player;
  const item = player.getHeldItem(event.hand);

  if (!item || item.id != 'kubejs:assault_rifle') return;

  event.cancel();

  let ammo = item.damage;

  if (ammo >= 40) {
    player.tell(Text.red('弾がありません。リロードしてください。'));
    return;
  }

  item.damage++;
  player.playSound('minecraft:entity.arrow.shoot', 1.0, 1.0);

  // 簡易レイキャスト（5ブロック先）
  let hit = player.rayTraceEntity(5, false);
  if (hit && hit.entity) {
    let target = hit.entity;
    target.hurtTime = 0; // 無敵時間リセット
    target.attack(DAMAGE);
  }

  // リコイル（上方向に視点変更）
  player.pitch -= 3;

  if (item.damage >= 40) {
    player.tell(Text.yellow('弾が切れました。リロードしてください。'));
  }
});

// リロード処理
onEvent('player.right_click', event => {
  const player = event.player;
  const item = player.getHeldItem(event.hand);

  if (!item || item.id != 'kubejs:assault_rifle') return;
  if (!player.isCrouching()) return;

  let inv = player.inventory;
  if (inv.count(RELOAD_ITEMS.gunpowder) < RELOAD_COST.gunpowder ||
      inv.count(RELOAD_ITEMS.iron_ingot) < RELOAD_COST.iron_ingot) {
    player.tell(Text.red('リロードに必要な素材が足りません。'));
    return;
  }

  inv.remove(RELOAD_ITEMS.gunpowder, RELOAD_COST.gunpowder);
  inv.remove(RELOAD_ITEMS.iron_ingot, RELOAD_COST.iron_ingot);

  item.damage = 0;
  player.tell(Text.green('リロード完了！弾が満タンになりました。'));
});
