/ レシピ登録
ServerEvents.recipes(event => {
  event.shaped('kubejs:assault_rifle', [
    'NGI',
    'IGI'
  ], {
    I: 'minecraft:iron',
    G: 'minecraft:gunpowder',
    N: 'minecraft:netherrite_ingot'
  });
StartupEvents.registry('item', event => {
  event.create('assault_rifle')
    .displayName('Assault Rifle')
    .maxStackSize(1)
    .group('combat')
    .texture('kubejs:item/assault_rifle')
    .properties(p => p.maxDamage(40)); // 弾数をダメージ値として管理（40発）
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
const ATTACK_SPEED = 6.4;

ItemEvents.rightClick(event => {
  const item = event.item;
  const player = event.player;

  if (item.id !== 'kubejs:assault_rifle') return;

  event.cancel(); // 通常の右クリックをキャンセル

  let ammo = item.getDamage();

  if (ammo >= 40) {
    player.tell('弾がありません。リロードしてください。');
    return;
  }

  // 発射処理
  ammo++;
  item.setDamage(ammo);

  // 発射音（バニラの銃声を代用）
  player.level.playSound(null, player.x, player.y, player.z, 'minecraft:entity.arrow.shoot', 'player', 1.0, 1.0);

  // 無敵時間無視でダメージを与える処理
  // 弾の命中処理は簡単に近距離の正面のエンティティに当てる形にする例

  const lookVec = player.getLookVec();
  const rayTrace = player.level.rayTrace(player, 5, false); // 5ブロック先まで

  if (rayTrace && rayTrace.entity) {
    let target = rayTrace.entity;
    if (target.hurtTime > 0) target.hurtTime = 0; // 無敵時間リセット
    target.damage(DAMAGE, player);
  }

  // リコイル処理（上方向に視点を少しずらす）
  const pitch = player.pitch - 3; // 3度上にずらす
  player.setPitch(pitch);

  // 弾切れ通知
  if (ammo >= 40) {
    player.tell('弾が切れました。リロードしてください。');
  }
});

// リロード処理（スニーク右クリックでリロード）
ItemEvents.useItem(event => {
  const item = event.item;
  const player = event.player;

  if (item.id !== 'kubejs:assault_rifle') return;

  if (!player.isSneaking()) return;

  // リロード可能か判定
  let inv = player.inventory;
  let hasGunpowder = inv.count(RELOAD_ITEMS.gunpowder) >= RELOAD_COST.gunpowder;
  let hasIron = inv.count(RELOAD_ITEMS.iron_ingot) >= RELOAD_COST.iron_ingot;

  if (!hasGunpowder || !hasIron) {
    player.tell('リロードに必要な素材が足りません。');
    return;
  }

  // 素材を消費
  inv.remove(RELOAD_ITEMS.gunpowder, RELOAD_COST.gunpowder);
  inv.remove(RELOAD_ITEMS.iron_ingot, RELOAD_COST.iron_ingot);

  // 弾数をリセット
  item.setDamage(0);
  player.tell('リロード完了！弾が満タンになりました。');
});
