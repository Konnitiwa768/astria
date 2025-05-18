// エンティティ登録
onEvent('entity.registry', e => {
    e.create('custom:leopard_starfish')
        .entityType('minecraft:zombie')
        .id('custom:leopard_starfish')
        .model('custom:starfish_model')
        .texture('custom:leopard_starfish_texture')
        .properties(p => p
            .health(55)
            .damage(5)
            .attackSpeed(1)
            .movementSpeed(0.35) // 通常より速め
        )
        .lootTable('custom:leopard_starfish_loot');
});

// スポーン設定
onEvent('entity.spawn', e => {
    e.addEntity('custom:leopard_starfish', (spawn) => {
        spawn
            .dimensions('undergarden:undergarden')
            .weight(6)
            .spawnCount(1)
            .spawnConditions((condition) => {
                condition.addCondition('minecraft:surfaces', 'minecraft:grass');
            });
    });
});

// ドロップテーブル
onEvent('loot_tables', e => {
    e.add('custom:leopard_starfish_loot', loot => {
        loot.addPool(pool => {
            pool.addItem('undergarden:utherium_shard', 2, 1); // 1〜2個のシャードをドロップ
        });
    });
});

// 攻撃時の効果付与
onEvent('entity.attack', event => {
    if (event.entity.type == 'custom:leopard_starfish') {
        let target = event.target;
        if (target && target.potionEffects) {
            target.potionEffects.add('minecraft:poison', 100, 2); // 毒III（5秒）
            target.potionEffects.add('custom:suiritai', 100, 0);  // suiritai（データパック登録済み）
        }
    }
});
