// ==========================
//   インフレクラフト：完全版！
//   経験値×インフレ＝超成長！
// ==========================

// レベルアップに必要な経験値：Lv1=24, Lv2=72, Lv3=216, ... 急成長！
const xpForLevel = level => Math.pow(3, level) * 8;

// HP倍率計算：Lv1=1, Lv2=3, Lv3=6, Lv4=12... Lv10で3倍バースト！
const hpMultiplier = level => {
  let base = 1;
  for (let i = 1; i <= level; i++) {
    base += Math.pow(2, i);
    if (i === 10) base *= 3;
  }
  return base;
};

// ==========================
//     世界レベル処理：1日ごとに強くなる！
// ==========================
ServerEvents.tick(e => {
  const overworld = e.server.overworld();
  const day = Math.floor(overworld.timeOfDay / 24000);
  e.server.persistentData.putInt('world_difficulty', day + 1);
});

// ==========================
//     プレイヤー初ログイン時処理
// ==========================
PlayerEvents.loggedIn(event => {
  const player = event.player;

  // 初期インフレ有効化
  if (!player.persistentData.contains('inflation_active')) {
    player.persistentData.putBoolean('inflation_active', true);
    player.persistentData.putInt('hp_level', 1);
    player.persistentData.putInt('hp_xp', 0);
    player.tell("インフレシステムが有効です！");
  }

  // hplvアッパー支給（1回限り）
  const UPPER_ITEM = Item.of('minecraft:iron_ingot', '{display:{Name:\'{"text":"hplvアッパー"}\'}}');
  if (!player.inventory.find(UPPER_ITEM)) {
    player.give(UPPER_ITEM);
  }
});

// ==========================
//     hplvアッパー使用時：GUI＆トグル！
// ==========================
ItemEvents.rightClicked(event => {
  const player = event.player;
  const UPPER_ITEM = Item.of('minecraft:iron_ingot', '{display:{Name:\'{"text":"hplvアッパー"}\'}}');

  if (event.item.equals(UPPER_ITEM)) {
    const active = player.persistentData.getBoolean('inflation_active');
    player.persistentData.putBoolean('inflation_active', !active);
    player.tell(active ? "インフレオフ：普通にプレイ中！" : "インフレオン：超成長モード！");

    // GUIを開く（任意定義）
    player.openMenu('kubejs:hpgui');
  }
});

// ==========================
//     敵の出現：レベルに応じて強化！
// ==========================
EntityEvents.spawned(event => {
  const entity = event.entity;
  if (!entity.isMob() || entity.isPlayer()) return;

  const worldLevel = event.level.persistentData.getInt('world_difficulty') || 1;
  const inflationActive = event.level.persistentData.getBoolean('inflation_active') ?? true;

  // 出現レベル決定（重み付き乱数）
  const possibleLevels = [];
  for (let i = 1; i <= worldLevel; i++) {
    const weight = i === worldLevel ? 2 : Math.max(1, worldLevel - i);
    for (let j = 0; j < weight; j++) possibleLevels.push(i);
  }
  const enemyLevel = possibleLevels[Math.floor(Math.random() * possibleLevels.length)];

  // HP倍率補正
  const baseHealth = entity.getHealth();
  const multiplier = inflationActive ? hpMultiplier(enemyLevel - 1) : 1;
  const newHP = baseHealth * multiplier;
  entity.maxHealth = newHP;
  entity.health = newHP;

  // 名前にレベル表示
  entity.customName = `Lv${enemyLevel} ${entity.displayName}`;
  entity.customNameVisible = true;
});

// ==========================
//     毎tick：プレイヤー能力を反映！
// ==========================
PlayerEvents.tick(event => {
  const player = event.player;
  const level = player.persistentData.getInt('hp_level') || 1;
  const inflationActive = player.persistentData.getBoolean('inflation_active') ?? true;

  // HP補正適用
  const newHP = 20 * (inflationActive ? hpMultiplier(level - 1) : 1);
  if (player.maxHealth !== newHP) player.setMaxHealth(newHP);

  // 攻撃力＆防御力補正
  const atkBonus = Math.floor(Math.pow(1.5, level)) * (inflationActive ? 2 : 1);
  const defBonus = Math.floor(Math.pow(1.3, level)) * (inflationActive ? 2 : 1);
  player.persistentData.putInt("atk_bonus", atkBonus);
  player.persistentData.putInt("def_bonus", defBonus);

  const applyModifier = (attr, uuid, name, value, op) => {
    if (player.getAttribute(attr).getModifier(uuid)) {
      player.getAttribute(attr).removeModifier(uuid);
    }
    player.getAttribute(attr).addPermanentModifier({
      id: uuid,
      name: name,
      amount: value,
      operation: op // 0: 加算
    });
  };

  applyModifier('generic.attack_damage', '75563e47-bc8a-4aa9-a579-b08836178e08', 'atk_boost', atkBonus, 0);
  applyModifier('generic.armor', 'd333f1f2-fbde-491c-975a-9b8c757a8291', 'def_boost', defBonus, 0);
});

// ==========================
//     敵撃破時：経験値加算＆レベルアップ！
// ==========================
EntityEvents.death(event => {
  const entity = event.entity;
  const source = event.source;
  if (!entity.isMob() || entity.isPlayer()) return;
  if (!source || !source.entity || !source.entity.isPlayer()) return;

  const player = source.entity;
  const name = entity.customName;
  if (!name || !name.startsWith("Lv")) return;

  const match = name.match(/^Lv(\d+)/);
  if (!match) return;

  const mobLevel = parseInt(match[1]);
  const gainXp = mobLevel * 10; // 敵のレベル×10 の経験値獲得！

  let xp = player.persistentData.getInt('hp_xp') || 0;
  let level = player.persistentData.getInt('hp_level') || 1;

  xp += gainXp;
  player.tell(`経験値 +${gainXp}（合計 ${xp}）`);

  // レベルアップ処理！
  while (xp >= xpForLevel(level)) {
    xp -= xpForLevel(level);
    level += 1;
    player.tell(`レベルアップ！現在のLvは ${level}！`);
  }

  player.persistentData.putInt('hp_xp', xp);
  player.persistentData.putInt('hp_level', level);
});
