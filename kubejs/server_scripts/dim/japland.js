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

  // レベル 1 - 基本食料
  event.trades.add(1, trade => {
    trade.inputItem('minecraft:emerald', 1);
    trade.outputItem('farmersdelight:cabbage', 2);
    trade.maxUses = 12;
    trade.xp = 1;
    trade.priceMultiplier = 0.05;
  });

  event.trades.add(1, trade => {
    trade.inputItem('minecraft:carrot', 6);
    trade.outputItem('minecraft:emerald', 1);
    trade.maxUses = 16;
    trade.xp = 1;
  });

  // レベル 2 - Create系素材と道具
  event.trades.add(2, trade => {
    trade.inputItem('minecraft:emerald', 4);
    trade.outputItem('minecraft:iron_ingot', 3);
  });

  event.trades.add(2, trade => {
    trade.inputItem('minecraft:emerald', 2);
    trade.outputItem('create:andesite_alloy', 4);
  });

  event.trades.add(2, trade => {
    trade.inputItem('minecraft:emerald', 3);
    trade.outputItem('minecraft:shield', 1);
    trade.maxUses = 5;
    trade.xp = 3;
  });

  // レベル 3 - 食料とツール
  event.trades.add(3, trade => {
    trade.inputItem('minecraft:emerald', 2);
    trade.outputItem('farmersdelight:stuffed_pumpkin', 1);
    trade.maxUses = 6;
    trade.xp = 4;
  });

  event.trades.add(3, trade => {
    trade.inputItem('minecraft:emerald', 6);
    trade.outputItem('minecraft:diamond_hoe', 1);
    trade.maxUses = 3;
    trade.xp = 5;
  });

  // レベル 4 - エンチャ本と鉱石
  event.trades.add(4, trade => {
    trade.inputItem('minecraft:emerald', 10);
    trade.outputItem('minecraft:enchanted_book', 1)
      .nbt('{StoredEnchantments:[{id:"minecraft:unbreaking",lvl:2}]}');
    trade.maxUses = 2;
    trade.xp = 10;
  });

  event.trades.add(4, trade => {
    trade.inputItem('minecraft:gold_ingot', 4);
    trade.outputItem('minecraft:emerald', 2);
    trade.maxUses = 6;
  });

  // レベル 5 - 高級品
  event.trades.add(5, trade => {
    trade.inputItem('minecraft:netherite_scrap', 1);
    trade.outputItem('minecraft:emerald', 5);
    trade.maxUses = 4;
  });

  event.trades.add(5, trade => {
    trade.inputItem('minecraft:emerald', 20);
    trade.outputItem('minecraft:totem_of_undying', 1);
    trade.maxUses = 1;
  });
});
// Neonina モブ登録
onEvent('entity.registry', event => {
  event.create('neonina')
    .displayName('Neonina')
    .egg(0xff44ff, 0x222222) // 鮮やかなピンクと黒
    .type('monster')
    .health(68)
    .speed(1.0)
    .damage(6)
    .flying() // 飛行可能
    .trackingRange(48)
    .updateInterval(2)
    .hitbox(0.6, 1.8)
    .ai(ai => {
      ai.attackPlayers();         // プレイヤーを攻撃
      ai.randomFlying();          // 空中をランダムに移動
      ai.randomLookAround();      // ランダムな視線
    });
});

// 攻撃時に「衰退II（4秒）」を付与
onEvent('entity.hurt', event => {
  if (event.source.entity?.type == 'kubejs:neonina' && event.entity.isLiving()) {
    event.entity.potionEffects.add('minecraft:withering', 80, 1); // 80tick = 4秒, Lv2
  }
});

// Neonina のドロップ設定
onEvent('entity.death', event => {
  if (event.entity.type == 'kubejs:neonina') {
    if (!event.entity.level.isClientSide()) {
      event.entity.level.server.runCommandSilent(`loot spawn ${event.entity.x} ${event.entity.y} ${event.entity.z} loot kubejs:entities/neonina`);
    }
  }
});
