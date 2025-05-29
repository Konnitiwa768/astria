// Sentury モブ登録 + スポーンエッグ + ステータス + AI + 攻撃効果（防具耐久削り・毒）

StartupEvents.registry('entity_type', event => {
  event.create('sentury')
    .category('monster')
    .size(0.9, 2.2)
    .trackingRange(32)
    .updateInterval(3)
    .fireImmune(false);
});

StartupEvents.registry('item', event => {
  event.create('sentury_spawn_egg')
    .type('spawn_egg')
    .displayName('Sentury Spawn Egg')
    .color(0x446622) // 背景色（暗緑）
    .overlayColor(0xAAFF66) // スポット色（毒っぽい）
    .entity('kubejs:sentury');
});

// ステータス設定
EntityEvents.spawned(event => {
  if (event.entity.type == 'kubejs:sentury') {
    let e = event.entity;
    e.maxHealth = 112;
    e.health = 112;
    e.attributes.set('generic.attack_damage', 7);
    e.attributes.set('generic.knockback_resistance', 0.2);
    e.attributes.set('generic.follow_range', 24);
  }
});

// AI: 基本的な攻撃対象追跡と近接攻撃実装
EntityEvents.loaded(event => {
  if (event.entity.type == 'kubejs:sentury') {
    let e = event.entity;

    // 近接攻撃 AI (攻撃間隔1秒、範囲1.5ブロック)
    e.setAI('minecraft:melee_attack', {
      attackInterval: 20,
      attackReach: 1.5
    });

    // 目標を探すAI（プレイヤー・村人など）
    e.setAI('minecraft:nearest_attackable_target', {
      targetSelector: ['minecraft:player', 'minecraft:villager'],
      checkSight: true,
      chance: 0.1
    });

    // パトロール・ウォーキングAI
    e.setAI('minecraft:random_stroll', {
      speed: 0.8
    });

    // 周囲を見回すAI
    e.setAI('minecraft:look_around');
  }
});

// 攻撃時処理：防具耐久を8削る + 毒6秒付与（難易度によらず）
EntityEvents.hurt(event => {
  if (event.source.entity?.type == 'kubejs:sentury' && event.entity.isPlayer()) {
    let player = event.entity;

    for (let i = 0; i < 4; i++) {
      let armor = player.getArmor(i);
      if (armor) {
        let level = armor.getEnchantLevel('minecraft:unbreaking');
        let chance = level > 0 ? 1 / (level + 1) : 1;
        if (Math.random() < chance) {
          armor.damage(8);
        }
      }
    }

    player.addEffect('minecraft:poison', 120, 0); // 毒6秒 (120ticks)
  }
});
