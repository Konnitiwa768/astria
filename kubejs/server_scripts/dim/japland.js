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

// 地形・構造物・木
onEvent('worldgen.add', event => {
  if (event.dimension !== 'kubejs:japland') return;

  event.addTree('oak', tree => {
    tree.configured = 'minecraft:oak';
    tree.chance = 3;
  });

  event.addFeature('underground_decoration', 'minecraft:amethyst_geode');
  event.addStructure('minecraft:mineshaft');
});

// Japone村人のスポーン処理
onEvent('entity.spawned', event => {
  if (event.entity.type == 'minecraft:villager' && event.entity.dimension == 'kubejs:japland') {
    event.entity.customName = '{"text":"Japone"}';
    event.entity.persistent = true;
    event.entity.tags.add('japone');
  }
});

// Japone村人の取引
onEvent('villager.trades', event => {
  if (!event.entity.tags.contains('japone')) return;

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
