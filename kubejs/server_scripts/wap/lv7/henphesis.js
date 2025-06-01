// === 1. レジストリ登録 ===
StartupEvents.registry('entity_type', event => {
  event.create('henphesis')
    .category('monster')
    .size(1.2, 2.8)
    .trackingRange(64)
    .updateInterval(3)
    .flying() // 飛行可能
    .spawnEgg(0x9933ff, 0x110022); // 紫・暗赤
});

// === 2. ステータス設定 ===
EntityEvents.spawned(event => {
  const e = event.entity;
  if (e.type !== 'kubejs:henphesis') return;

  e.maxHealth = 310;
  e.health = 310;
  e.attributes.set('generic.armor', 11);
  e.attributes.set('generic.attack_damage', 14);
  e.attributes.set('generic.follow_range', 32);
  e.attributes.set('generic.movement_speed', 0.35);
  e.attributes.set('generic.knockback_resistance', 0.4);
  e.xpReward = 2000;
  e.persistentData.summonTimer = 0;
  e.persistentData.hasSummoned = false;
  e.customName = Text.of('Henphesis').withStyle({italic: false, color: 'light_purple'});
  e.persistent = true;
});

// === 3. AI/ゴール設定 ===
EntityEvents.addAI(event => {
  const e = event.entity;
  if (e.type !== 'kubejs:henphesis') return;

  // すべてのAIを一旦クリア
  e.goalSelectors.clear();
  e.targetSelectors.clear();

  // ランダム飛行
  e.goalSelectors.add(0, 'minecraft:random_flying', { speed: 1.2 });

  // 近接攻撃
  e.goalSelectors.add(1, 'minecraft:melee_attack', { speed: 1.1, pauseWhenMobIdle: false });

  // プレイヤーを見つめる
  e.goalSelectors.add(2, 'minecraft:look_at', { entity_type: 'minecraft:player', range: 16.0 });

  // ランダムに周囲を見る
  e.goalSelectors.add(3, 'minecraft:look_randomly', {});

  // プレイヤーを攻撃対象に
  e.targetSelectors.add(0, 'minecraft:nearest_attackable_target', { predicate: 'minecraft:player' });
});

// === 4. 定期的な召喚 & 真下即死 ===
EntityEvents.tick(event => {
  const e = event.entity;
  if (e.type !== 'kubejs:henphesis') return;

  // スポーン時1回目の3体召喚
  if (!e.persistentData.hasSummoned) {
    summonMinions(e);
    e.persistentData.hasSummoned = true;
  }

  // 定期的召喚（20秒ごと）
  e.persistentData.summonTimer = (e.persistentData.summonTimer || 0) + 1;
  if (e.persistentData.summonTimer >= 20 * 20) {
    summonMinions(e);
    e.persistentData.summonTimer = 0;
  }

  // HP33%以下＆真下プレイヤーに即死ダメージ
  if (e.health <= e.maxHealth * 0.33) {
    let aabb = AABB.of(
      e.x - 1, e.y - 3, e.z - 1,
      e.x + 1, e.y, e.z + 1
    );
    e.level.getEntitiesWithin(aabb).forEach(target => {
      if (target.isPlayer() && Math.abs(target.x - e.x) < 1 && Math.abs(target.z - e.z) < 1 && target.y < e.y) {
        target.attack(e, 9999);
      }
    });
  }
});

// === 5. 召喚関数 ===
function summonMinions(entity) {
  let pos = entity.position;
  let server = entity.server;
  server.runCommandSilent(`summon kubejs:scultoxic ${pos.x + 2} ${pos.y} ${pos.z}`);
  server.runCommandSilent(`summon kubejs:dark_bomber ${pos.x - 2} ${pos.y} ${pos.z}`);
  server.runCommandSilent(`summon kubejs:nuxuol ${pos.x} ${pos.y} ${pos.z + 2}`);
}
