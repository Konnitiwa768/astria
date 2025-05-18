// ======= 設定値（理論上無限） =======
const xpForLevel = n => Math.pow(3, n) * 8;
const hpMultiplier = n => Math.pow(6, n); // HP倍率（1倍, 6倍, 36倍...）

// ======= ワールド難易度（日数ベース） =======
ServerEvents.tick(e => {
  const overworld = e.server.overworld();
  const day = Math.floor(overworld.timeOfDay / 24000);
  const level = day + 1;
  e.server.persistentData.putInt('world_difficulty', level);
});

// ======= インフレ切り替えトグル（初期値：有効） =======
PlayerEvents.loggedIn(event => {
  const player = event.player;
  if (!player.persistentData.contains('inflation_active')) {
    player.persistentData.putBoolean('inflation_active', true);
    player.tell("インフレシステムが有効になっています。");
  }

  const UPPER_ITEM = Item.of('minecraft:iron_ingot', '{display:{Name:\'{"text":"hplvアッパー"}\'}}');
  if (!player.inventory.find(UPPER_ITEM)) {
    player.give(UPPER_ITEM);
  }
});

// ======= GUI呼び出しとトグル切り替え =======
ItemEvents.rightClicked(event => {
  const player = event.player;
  const UPPER_ITEM = Item.of('minecraft:iron_ingot', '{display:{Name:\'{"text":"hplvアッパー"}\'}}');
  if (event.item.equals(UPPER_ITEM)) {
    // GUI開く（任意）
    player.openMenu('kubejs:hpgui');

    // トグル
    const inflationActive = player.persistentData.getBoolean('inflation_active');
    player.persistentData.putBoolean('inflation_active', !inflationActive);
    player.tell(inflationActive ? "インフレシステムが無効になりました。" : "インフレシステムが有効になりました。");
  }
});

// ======= 敵生成時のレベル決定・強化処理 =======
EntityEvents.spawned(event => {
  const entity = event.entity;
  if (!entity.isMob() || entity.isPlayer()) return;

  const worldLevel = event.level.persistentData.getInt('world_difficulty') || 1;
  const inflationActive = entity.level.persistentData.getBoolean('inflation_active') ?? true;

  // 分布関数によるレベル決定
  function getEnemyLevel(day) {
    const rng = Math.random();
    let level = 1;
    let total = 0;

    while (true) {
      const weight = Math.max(0, 1 - Math.abs(day - 2 * level + 1) / (level + 1));
      total += weight;
      if (rng < total) return level;
      level++;
      if (level > 100) break;
    }

    return level;
  }

  const day = Math.max(1, Math.floor(entity.level.timeOfDay / 24000));
  const enemyLevel = getEnemyLevel(day);

  // HP補正
  const baseHealth = entity.getHealth();
  const healthMultiplier = inflationActive ? 2 : 1;
  const adjustedHealth = baseHealth * healthMultiplier * Math.pow(2, enemyLevel / 10);

  entity.maxHealth = adjustedHealth;
  entity.health = adjustedHealth;

  // 名前変更
  entity.customName = `Lv${enemyLevel} ${entity.displayName}`;
  entity.customNameVisible = true;
});

// ======= プレイヤーのHP・攻撃・防御補正処理 =======
PlayerEvents.tick(event => {
  const player = event.player;
  const level = player.persistentData.getInt('hp_level') || 1;
  const inflationActive = player.persistentData.getBoolean('inflation_active') ?? true;

  // HP補正
  const newHP = 20 * hpMultiplier(level - 1);
  if (player.maxHealth !== newHP) player.setMaxHealth(newHP);

  // ======= 攻撃・防御力補正（ここが該当部分） =======
  const atkBonus = Math.floor(Math.pow(1.5, level)) * (inflationActive ? 2 : 1);
  const defBonus = Math.floor(Math.pow(1.3, level)) * (inflationActive ? 2 : 1);

  player.persistentData.putInt("atk_bonus", atkBonus);
  player.persistentData.putInt("def_bonus", defBonus);

  // 必要なら表示
  // player.actionbar(`攻撃補正: +${atkBonus} 防御補正: +${defBonus}`);
});
