StartupEvents.registry('entity_type', event => {
  // Sulcon_lv3
  event.create('sulcon_lv3')
    .category('monster')
    .size(0.8, 2.0)
    .trackingRange(32)
    .updateInterval(3)
    .fireImmune(true)
    .clientTrackingRange(10);

  // Sulcon_lv4
  event.create('sulcon_lv4')
    .category('monster')
    .size(0.8, 2.0)
    .trackingRange(32)
    .updateInterval(3)
    .fireImmune(true)
    .clientTrackingRange(10);
});

StartupEvents.registry('attribute', event => {
  // 基本的な属性登録（攻撃力や防御力）
  event.create('generic.max_health')
    .defaultValue(20)
    .minValue(1)
    .maxValue(1024);

  event.create('generic.attack_damage')
    .defaultValue(2)
    .minValue(0)
    .maxValue(1024);

  event.create('generic.armor')
    .defaultValue(0)
    .minValue(0)
    .maxValue(30);

  event.create('generic.movement_speed')
    .defaultValue(0.25)
    .minValue(0)
    .maxValue(1024);
});
EntityEvents.spawned(event => {
  const e = event.entity;

  if (e.type == "kubejs:sulcon_lv3") {
    e.setMaxHealth(140);
    e.setHealth(140);
    e.getAttribute('generic.armor').baseValue = 8;
    e.getAttribute('generic.attack_damage').baseValue = 6; // 必要に応じ調整
    e.getAttribute('generic.movement_speed').baseValue = 0.23;

    e.persistentData.put("summoned", false);
  }

  if (e.type == "kubejs:sulcon_lv4") {
    e.setMaxHealth(220);
    e.setHealth(220);
    e.getAttribute('generic.armor').baseValue = 9;
    e.getAttribute('generic.attack_damage').baseValue = 7;
    e.getAttribute('generic.movement_speed').baseValue = 0.22;

    e.persistentData.put("ai_disabled", false);
    e.persistentData.put("summonTimer", 0);
  }
});

EntityEvents.livingTick(event => {
  const e = event.entity;

  if (e.type == "kubejs:sulcon_lv3") {
    if (e.health < e.getMaxHealth() / 2 && !e.persistentData.get("summoned")) {
      for (let i = 0; i < 3; i++) {
        const dx = e.x + (Math.random() * 4 - 2);
        const dz = e.z + (Math.random() * 4 - 2);
        event.server.runCommandSilent(`summon kubejs:phase3_unit ${dx} ${e.y} ${dz}`);
      }
      e.persistentData.put("summoned", true);
    }

    e.level.getEntitiesWithin(e.boundingBox.inflate(6), t => t.isAlive() && t.type != e.type).forEach(t => {
      t.addEffect("minecraft:regeneration", 60, 2); // Regeneration III
      t.addEffect("minecraft:strength", 60, 0); // Strength I
    });
  }

  if (e.type == "kubejs:sulcon_lv4") {
    const below = e.block.id;
    const disabled = e.persistentData.get("ai_disabled");

    if (below == "minecraft:lava") {
      if (!disabled) e.persistentData.put("ai_disabled", true);
    } else {
      if (disabled) e.persistentData.put("ai_disabled", false);
    }

    if (e.persistentData.get("ai_disabled")) return;

    const draizer = e.level.getEntitiesWithin(e.boundingBox.inflate(20), d => d.type == "kubejs:draizer")[0];
    if (draizer) {
      e.teleportTo(draizer.x + 1.5, draizer.y, draizer.z + 1.5);
    }

    let timer = e.persistentData.get("summonTimer") + 1;
    if (timer >= 100) {
      for (let i = 0; i < 2; i++) {
        const dx = e.x + (Math.random() * 6 - 3);
        const dz = e.z + (Math.random() * 6 - 3);
        event.server.runCommandSilent(`summon kubejs:phase3_unit ${dx} ${e.y} ${dz}`);
      }
      timer = 0;
    }
    e.persistentData.put("summonTimer", timer);

    e.level.getEntitiesWithin(e.boundingBox.inflate(6), t => t.isAlive() && t.type != e.type).forEach(t => {
      t.addEffect("minecraft:regeneration", 60, 2); // Regeneration III
      t.addEffect("minecraft:strength", 60, 1); // Strength II
    });
  }
});
