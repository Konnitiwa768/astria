// ディメンション登録
onEvent('server.datapack.high_priority', event => {
  event.addDimension('kubejs:japland', dim => {
    dim.displayName = 'Japland - ポーランドボールの住処';
    dim.generator = {
      type: 'minecraft:noise',
      settings: 'kubejs:japland_settings'
    };
    dim.effects = 'minecraft:overworld';
    dim.natural = true;
    dim.hasSkylight = true;
    dim.hasCeiling = false;
    dim.ultrawarm = false;
    dim.ambientLight = 0.0;
  });
});

// 地形・構造物・木の追加
onEvent('worldgen.add', event => {
  if (event.dimension !== 'kubejs:japland') return;

  event.addTree('oak', tree => {
    tree.configured = 'minecraft:oak';
    tree.chance = 3;
  });

  event.addFeature('underground_decoration', 'minecraft:amethyst_geode');
  event.addStructure('minecraft:mineshaft');
});

// Japoneモブ登録（独自モブ）
onEvent('entity.registry', event => {
  event.create('japone')
    .displayName('Japone')
    .egg((0xeeeeee), (0x111133))
    .type('mob')
    .health(20)
    .speed(0.5)
    .damage(2)
    .trackingRange(32)
    .updateInterval(2)
    .hitbox(0.6, 1.8)
    .ai(ai => {
      ai.basicAttack();
      ai.avoid('minecraft:zombie', 6.0, 1.0, 1.2);
      ai.lookAtPlayer(8.0);
      ai.randomStroll();
      ai.randomLookAround();
    });
});

// Japoneの取引
onEvent('entity.spawned', event => {
  if (event.entity.type == 'kubejs:japone') {
    event.entity.persistent = true;
  }
});

onEvent('villager.trades', event => {
  if (event.entity.type != 'kubejs:japone') return;

  event.trades.add(1, trade => {
    trade.inputItem('minecraft:emerald', 1);
    trade.outputItem('farmersdelight:cabbage', 2);
    trade.maxUses = 12;
    trade.xp = 1;
    trade.priceMultiplier = 0.05;
  });

  event.trades.add(2, trade => {
    trade.inputItem('minecraft:emerald', 4);
    trade.outputItem('minecraft:iron_ingot', 3);
  });
});
