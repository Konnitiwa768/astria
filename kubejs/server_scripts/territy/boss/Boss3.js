// ムラサキガーディアン ボス実装 (objモデル対応前提)
// 召喚・タグ・AI・HP同期・特殊攻撃・ドロップ含む

let murasakiGuardianFrenzy = {};

// ダイヤ10個投げてスペクトリウムランプブロックの上で召喚
ItemEvents.entityItemPickup(event => {
    let item = event.getItem();
    let entity = event.getEntity();
    if (item.id === 'minecraft:diamond' && item.getStackSize() >= 10) {
        let block = entity.level.getBlock(Math.floor(item.x), Math.floor(item.y) - 1, Math.floor(item.z));
        if (block.id === 'kubejs:spectrium_lamp') {
            // ダイヤ10個消費
            item.shrink(10);
            // ボス召喚
            entity.level.server.runCommandSilent(
                `summon kubejs:murasaki_guardian ${item.x} ${item.y} ${item.z} {CustomName:'{"text":"ムラサキガーディアン"}'}`
            );
            entity.level.server.runCommandSilent(
                `bossbar add kubejs:murasaki_guardian {"text":"ムラサキガーディアン"}`
            );
            entity.level.server.runCommandSilent(
                `bossbar set kubejs:murasaki_guardian max 1024`
            );
            entity.level.server.runCommandSilent(
                `bossbar set kubejs:murasaki_guardian value 1024`
            );
            entity.level.server.runCommandSilent(
                `bossbar set kubejs:murasaki_guardian visible true`
            );
            entity.level.spawnParticles('end_rod', item.x, item.y + 1, item.z, 50, 1, 0.5, 1, 0.05);
            entity.level.playSound('minecraft:entity.evoker.prepare_summon', item.x, item.y, item.z, 2, 1);
        }
    }
});

PlayerEvents.rightClickEntity(event => {
    let entity = event.target;
    if (entity.type == 'kubejs:murasaki_guardian' && entity.getHealth() <= 512 && !entity.getTags().contains('mg_frenzy')) {
        if (event.item.id === 'minecraft:emerald') {
            entity.addTag('mg_frenzy');
            event.player.tell(Text.lightPurple('ムラサキガーディアンが覚醒した！'));
            event.item.shrink(1);
            entity.level.server.runCommandSilent(
                `bossbar set kubejs:murasaki_guardian color purple`
            );
        }
    }
});

// HP・AI同期 & 技発動
ServerEvents.tick(event => {
    event.server.getAllLevels().forEach(level => {
        level.getEntities().forEach(entity => {
            if (entity.type == 'kubejs:murasaki_guardian') {
                entity.setMaxHealth(1024);
                entity.setHealth(Math.min(entity.getHealth(), 1024));
                entity.setMovementSpeed(1.2);
                entity.setAttackDamage(12.5);
                entity.addTag('boss');
                // ボスバー HP同期
                event.server.runCommandSilent(
                  `bossbar set kubejs:murasaki_guardian value ${Math.floor(entity.getHealth())}`
                );
                // 本気モード時: 特殊AI
                if (entity.getTags().contains('mg_frenzy')) {
                    // 森羅万象破壊: 10%で発動
                    if (Math.random() < 0.10) worldDestruction(entity);
                    // 紫の雷撃: 20%で発動
                    if (Math.random() < 0.20) purpleLightning(entity);
                    // 範囲スロー: 15%で発動
                    if (Math.random() < 0.15) slowAura(entity);
                } else {
                    // 通常時はたまに自己回復（10%）
                    if (Math.random() < 0.10) healSelf(entity);
                }
            }
        });
    });
});

// 死亡時ドロップ & ボスバー消去（8種）
EntityEvents.death(event => {
    let entity = event.getEntity();
    if (entity.type == 'kubejs:murasaki_guardian') {
        event.level.server.runCommandSilent(`bossbar remove kubejs:murasaki_guardian`);
        let drops = event.getDrops();
        drops.clear();
        if (Math.random() < 0.3) drops.add(Item.of(''));
        if (Math.random() < 0.4) drops.add(Item.of('minecraft:netherite_ingot', 2));
        if (Math.random() < 0.5) drops.add(Item.of('kubejs:demlight_ingot', 4));
        if (Math.random() < 0.6) drops.add(Item.of('kubejs:cutoric_smithing_upgrade', 5));
        if (Math.random() < 0.7) drops.add(Item.of('kubejs:lightning_stinger'));
        if (Math.random() < 0.8) drops.add(Item.of('minecraft:emerald', 7));
        if (Math.random() < 0.8) drops.add(Item.of('kubejs:ancient_scroll'));
        drops.add(Item.of('kubejs:magical_soul')); // 100%固定
    }
});

// --- 技定義 ---
// 森羅万象破壊（5×5×5空間をairに）
function worldDestruction(entity) {
    let cx = Math.floor(entity.x);
    let cy = Math.floor(entity.y);
    let cz = Math.floor(entity.z);
    for(let dx = -2; dx <= 2; dx++) {
        for(let dy = -2; dy <= 2; dy++) {
            for(let dz = -2; dz <= 2; dz++) {
                let bx = cx + dx;
                let by = cy + dy;
                let bz = cz + dz;
                if(entity.level.getBlock(bx, by, bz).id != 'minecraft:air') {
                    entity.level.setBlock(bx, by, bz, 'minecraft:air');
                }
            }
        }
    }
    entity.level.spawnParticles('explosion', cx, cy+1, cz, 20, 2, 2, 2, 0.2);
    entity.level.playSound('minecraft:entity.ender_dragon.growl', entity.x, entity.y, entity.z, 2, 1);
}

// 紫の雷撃（範囲内のプレイヤーに雷+ダメージ）
function purpleLightning(entity) {
    let x = entity.x, y = entity.y, z = entity.z;
    entity.level.spawnLightningBolt(x, y, z, false);
    entity.level.getEntitiesWithinAABB('minecraft:player', x-4, y-2, z-4, x+4, y+2, z+4).forEach(player => {
        player.attack(18, 'magic');
        player.addEffect('minecraft:glowing', 80, 1);
    });
}

// 範囲スロー（周囲のプレイヤーに鈍足）
function slowAura(entity) {
    let x = entity.x, y = entity.y, z = entity.z;
    entity.level.getEntitiesWithinAABB('minecraft:player', x-5, y-2, z-5, x+5, y+2, z+5).forEach(player => {
        player.addEffect('minecraft:slowness', 100, 2);
    });
    entity.level.spawnParticles('portal', x, y+1, z, 30, 1, 0.3, 1, 0.1);
}

// 自己回復（HPが減っている時に回復）
function healSelf(entity) {
    if (entity.getHealth() < entity.getMaxHealth()) {
        entity.setHealth(entity.getHealth() + 12);
        entity.level.spawnParticles('happy_villager', entity.x, entity.y+1, entity.z, 15, 0.5, 0.3, 0.5, 0.05);
    }
}
