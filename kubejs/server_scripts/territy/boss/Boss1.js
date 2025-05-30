// ファイル例: kubejs/server_scripts/scane_king_boss.js

let emeraldsOnDiamond = {};

ItemEvents.entityDropped(event => {
    let item = event.getEntity();
    if (item.item.id == 'minecraft:emerald') {
        let blockBelow = item.level.getBlock(item.blockPosition.down());
        if (blockBelow.id == 'minecraft:diamond_block') {
            let key = `${item.blockPosition.down().x},${item.blockPosition.down().y},${item.blockPosition.down().z}`;
            emeraldsOnDiamond[key] = (emeraldsOnDiamond[key] || 0) + item.item.count;
            if (emeraldsOnDiamond[key] >= 10) {
                // ボス召喚
                item.level.server.runCommandSilent(
                    `summon kubejs:scane ${item.blockPosition.down().x + 0.5} ${item.blockPosition.down().y + 1} ${item.blockPosition.down().z + 0.5} {CustomName:'{"text":"King, God of Scanes"}',Health:1024f,Attributes:[{Name:"generic.max_health",Base:1024},{Name:"generic.attack_damage",Base:12}],Tags:["boss","scane_king"]}`
                );
                // ボスバー追加
                item.level.server.runCommandSilent(
                    `bossbar add kubejs:scane_king {"text":"King, God of Scanes"}`
                );
                item.level.server.runCommandSilent(
                    `bossbar set kubejs:scane_king max 1024`
                );
                item.level.server.runCommandSilent(
                    `bossbar set kubejs:scane_king value 1024`
                );
                item.level.server.runCommandSilent(
                    `bossbar set kubejs:scane_king visible true`
                );
                emeraldsOnDiamond[key] = 0;
            }
        }
    }
});

ServerEvents.tick(event => {
    event.server.getAllLevels().forEach(level => {
        level.getEntities().forEach(entity => {
            if (entity.getTags().contains("scane_king")) {
                // ボスバーHP同期
                event.server.runCommandSilent(
                  `bossbar set kubejs:scane_king value ${Math.floor(entity.getHealth())}`
                );
                // 10秒ごとに64回復
                if (entity.ticksExisted % 200 === 0) {
                    let maxHp = entity.getAttribute("generic.max_health").baseValue;
                    entity.setHealth(Math.min(entity.getHealth() + 64, maxHp));
                }
                // 背後ワープ（100tickごと、プレイヤー12ブロック以内）
                let nearestPlayer = level.getNearestPlayer(entity, 12);
                if (nearestPlayer && entity.ticksExisted % 100 === 0) {
                    let yaw = nearestPlayer.yRot * Math.PI / 180;
                    let behind = nearestPlayer.position().add(
                        -Math.sin(yaw) * 2, 0, Math.cos(yaw) * 2
                    );
                    entity.setPosition(behind.x, behind.y, behind.z);
                }
            }
        });
    });
});

EntityEvents.death(event => {
    let entity = event.getEntity();
    if (entity.getTags().contains("scane_king")) {
        // ボスバー消去
        event.level.server.runCommandSilent(
            `bossbar remove kubejs:scane_king`
        );
        // 確率付きドロップ
        let drops = event.getDrops();
        drops.clear();
        if (Math.random() < 0.8) drops.add(Item.of('kubejs:spectrium_smithing_upgrade'));
        if (Math.random() < 0.6) drops.add(Item.of('kubejs:demlight_scrap'.withCount(6));
        if (Math.random() < 0.3) drops.add(Item.of('minecraft:netherite_ingot'));
        if (Math.random() < 0.6) drops.add(Item.of('minecraft:emerald').withCount(3));
        if (Math.random() < 0.6) drops.add(Item.of('minecraft:gold_ingot').withCount(8));
        if (Math.random() < 0.4) drops.add(Item.of('minecraft:diamond').withCount(2));
        if (Math.random() < 0.33) drops.add(Item.of('scalinghealth:heart_crystal').withCount(4));
    }
});
