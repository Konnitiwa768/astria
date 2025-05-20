// ======= 設定値（理論上無限） =======
// 経験値の計算式（例：8,24,72,...）
const xpForLevel = n => Math.pow(3, n) * 8;

// HP倍率：1,3,9,21,...倍を加算式で実装（例）
const hpMultiplier = n => {
  // nはレベル-1(0始まり)
  let hp = 1;
  let add = 2;
  for (let i = 0; i < n; i++) {
    hp += add;
    add *= 2;
  }
  return hp;
};

// ======= ワールド難易度（敵生成レベル分布） =======
ServerEvents.tick(e => {
  const overworld = e.server.overworld();
  const day = Math.floor(overworld.timeOfDay / 24000); // 日数
  const level = day + 1; // Lvは1日目で1からスタート
  e.server.persistentData.putInt('world_difficulty', level);
});

// ======= インフレ切り替えトグル（初期値：有効） =======
PlayerEvents.loggedIn(event => {
  const player = event.player;
  if (!player.persistentData.contains('inflation_active')) {
    player.persistentData.putBoolean('inflation_active', true);
    player.tell("インフレシステムが有効になっています。");
  }

  // 「hplvアッパー」アイテムを配布（持ってなければ）
  const UPPER_ITEM = Item.of('minecraft:iron_ingot', '{display:{Name:\'{"text":"hplvアッパー"}\'}}');
  if (!player.inventory.find(UPPER_ITEM)) {
    player.give(UPPER_ITEM);
  }
});

// ======= GUI呼び出し（アッパー右クリック） =======
ItemEvents.rightClicked(event => {
  const UPPER_ITEM = Item.of('minecraft:iron_ingot', '{display:{Name:\'{"text":"hplvアッパー"}\'}}');
  if (event.item.equals(UPPER_ITEM)) {
    event.player.openMenu('kubejs:hpgui');
  }
});

// ======= インフレシステムの切り替え =======
ItemEvents.rightClicked(event => {
  const player = event.player;
  const UPPER_ITEM = Item.of('minecraft:iron_ingot', '{display:{Name:\'{"text":"hplvアッパー"}\'}}');
  if (event.item.equals(UPPER_ITEM)) {
    const inflationActive = player.persistentData.getBoolean('inflation_active');
    player.persistentData.putBoolean('inflation_active', !inflationActive);
    player.tell(inflationActive ? "インフレシステムが無効になりました。" : "インフレシステムが有効になりました。");
  }
});

// ======= 敵生成時にレベル分布に応じてHP等変化 =======
EntityEvents.spawned(event => {
  const entity = event.entity;
  if (!entity.isMob() || entity.isPlayer()) return;

  // ワールド難易度（敵レベル）を取得
  const worldLevel = event.level.persistentData.getInt('world_difficulty') || 1;

  // インフレの有無（ワールド共通で設定可能に）
  const inflationActive = event.level.persistentData.getBoolean('inflation_active');
  // インフレ無設定の場合は有効扱い
  const inflation = inflationActive === undefined ? true : inflationActive;

  // 敵レベル計算（例：worldLevelの1.5乗を切り捨て）
  const enemyLevel = Math.min(2147483647, Math.floor(Math.pow(worldLevel, 1.5)));

  // 元のHPを取得
  const baseHealth = entity.getHealth();

  // インフレ適用HP倍率
  const healthMultiplier = inflation ? 2 : 1;

  // レベルに応じてHP増加（2のenemyLevel/10乗）
  const adjustedHealth = baseHealth * healthMultiplier * Math.pow(2, enemyLevel / 10);

  // HP設定
  entity.maxHealth = adjustedHealth;
  entity.health = adjustedHealth;

  // 名前にレベル表示を追加
  entity.customName = `Lv${enemyLevel} ${entity.getDisplayName().getString()}`;
  entity.setCustomNameVisible(true);
});

// ======= 敵死亡時の経験値追加 =======
EntityEvents.death(event => {
  const entity = event.entity;
  if (!entity.isMob() || entity.isPlayer()) return;

  const customName = entity.customName;
  if (!customName || !customName.startsWith('Lv')) return;

  // レベル部分を抽出
  const match = customName.match(/^Lv(\d+)/);
  if (!match) return;
  const level = parseInt(match[1]);

  // 経験値付与量：レベルに比例しつつランダム性あり
  const bonusXP = Math.floor(level * 1.5 + Math.random() * 4);

  // 経験値をスポーン
  entity.level.spawnExperience(entity.position(), bonusXP);
});

// ======= プレイヤーのHP・攻撃・防御力更新 =======
PlayerEvents.tick(event => {
  const player = event.player;
  const level = player.persistentData.getInt('hp_level') || 1;
  const inflationActive = player.persistentData.getBoolean('inflation_active');
  const inflation = inflationActive === undefined ? true : inflationActive;

  // HP倍率計算
  const newHP = 20 * hpMultiplier(level - 1);

  // 最大HP設定（変更時のみ）
  if (player.maxHealth !== newHP) player.setMaxHealth(newHP);

  // 攻撃力・防御力ボーナス計算
  // 攻撃力は1.5の累乗、防御力は1.3の累乗
  // インフレ有効なら2倍
  const atkBonus = Math.floor(Math.pow(1.5, level)) * (inflation ? 2 : 1);
  const defBonus = Math.floor(Math.pow(1.3, level)) * (inflation ? 2 : 1);

  // 永続データに保存（他の処理で参照可能）
  player.persistentData.putInt("atk_bonus", atkBonus);
  player.persistentData.putInt("def_bonus", defBonus);
});
