// === レジストリ登録 ===
StartupEvents.registry('entity_type', event => {
  event.create('wruvam')
    .category('monster')
    .size(1.2, 2.8)
    .trackingRange(64)
    .updateInterval(3)
    .flying()
    .spawnEgg(0xeebb44, 0x552211);
});

// === ステータス設定 ===
EntityEvents.spawned(event => {
  const e = event.entity;
  if (e.type !== 'kubejs:wruvam') return;
  e.maxHealth = 115;
  e.health = 115;
  e.attributes.set('generic.attack_damage', 20);
  e.attributes.set('generic.follow_range', 32);
  e.attributes.set('generic.movement_speed', 0.35);
  e.attributes.set('generic.knockback_resistance', 0.4);
  e.xpReward = 11;
  e.customName = Text.of('Wruvam').withStyle({italic: false, color: 'gold'});
  e.persistent = true;
});

// === AI設定 ===
EntityEvents.addAI(event => {
  const e = event.entity;
  if (e.type !== 'kubejs:wruvam') return;
  e.goalSelectors.clear();
  e.targetSelectors.clear();
  e.goalSelectors.add(0, 'minecraft:random_flying', { speed: 1.2 });
  e.goalSelectors.add(1, 'minecraft:melee_attack', { speed: 1.1, pauseWhenMobIdle: false });
  e.goalSelectors.add(2, 'minecraft:look_at', { entity_type: 'minecraft:player', range: 16.0 });
  e.goalSelectors.add(3, 'minecraft:look_randomly', {});
  e.targetSelectors.add(0, 'minecraft:nearest_attackable_target', { predicate: 'minecraft:player' });
});

// === 周囲の特定モブにtp＋Strength IV付与 ===
const NEAR_RADIUS = 16;
const STRENGTH_DURATION = 20 * 10; // 10秒
EntityEvents.tick(event => {
  const e = event.entity;
  if (e.type !== 'kubejs:wruvam') return;
  let found = e.level.getEntitiesWithin(AABB.of(
    e.x - NEAR_RADIUS, e.y - NEAR_RADIUS, e.z - NEAR_RADIUS,
    e.x + NEAR_RADIUS, e.y + NEAR_RADIUS, e.z + NEAR_RADIUS
  )).find(ent =>
    ['kubejs:henphesis', 'kubejs:sentury', 'kubejs:kyrphos'].includes(ent.type) && ent.id !== e.id
  );
  if (found) {
    e.setPosition(found.x, found.y, found.z);
    found.addEffect('minecraft:strength', STRENGTH_DURATION, 3);
  }
});

// === マグマで追加ダメージ ===
EntityEvents.hurt(event => {
  const e = event.entity;
  if (e.type !== 'kubejs:wruvam') return;
  if (event.damageSource.type == 'lava' || event.damageSource.type == 'hot_floor') {
    e.damage(15, event.damageSource);
  }
});
