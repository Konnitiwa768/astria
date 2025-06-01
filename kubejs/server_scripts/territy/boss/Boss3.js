// ==== エンティティレジストリ（entity_registry.js等で必須） ====
EntityEvents.registry(event => {
    event.create('murasaki_guardian')
        .displayName('ムラサキガーディアン')
        .egg('a15aff', 'c4aaff') // 紫系スポーンエッグ色
        .renderer('kubejs:murasaki_guardian') // GeckoLibやobjモデル用
        .trackingRange(48)
        .fireImmune(true)
        .category('monster')
        .size(1.1, 2.3);
});

// ==== ボス実装（boss/Boss3.js等） ====
let murasakiGuardianFrenzy = {};

// --- 召喚（ダイヤ10個+スペクトリウムランプ） ---
ItemEvents.entityItemPickup(event => {
    let item = event.getItem();
    let entity = event.getEntity();
    if (item.id === 'minecraft:diamond' && item.getStackSize() >= 10) {
        let block = entity.level.getBlock(Math.floor(item.x), Math.floor(item.y) - 1, Math.floor(item.z));
        if (block.id === 'kubejs:spectrium_lamp') {
            item.shrink(10);
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

// --- 本気モード切り替え ---
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

// --- AI・HP同期・攻撃・技 ---
ServerEvents.tick(event => {
    event.server.getAllLevels().forEach(level => {
        level.getEntities().forEach(entity => {
            if (entity.type == 'kubejs:murasaki_guardian') {
                // ステータス
                entity.setMaxHealth(1024);
                entity.setHealth(Math.min(entity.getHealth(), 1024));
                entity.setMovementSpeed(1.3);
                entity.setAttackDamage(12.5);
                entity.addTag('boss');
                // ボスバー HP同期
                event.server.runCommandSilent(
                    `bossbar set kubejs:murasaki_guardian value ${Math.floor(entity.getHealth())}`
                );
                // ======== 飛行・追尾・攻撃AI(goals) ========
                let target = entity.level.getClosestPlayer(entity, 32);
                if (target != null) {
                    let tx = target.x, ty = target.y, tz = target.z;
                    let dx = tx - entity.x;
                    let dz = tz - entity.z;
                    let dy = (ty + 2) - entity.y;
                    let mag = Math.sqrt(dx*dx + dz*dz);
                    if (mag > 1) {
                        dx /= mag; dz /= mag;
                    }
                    entity.setMotion(dx * 0.33, dy * 0.15, dz * 0.33);
                    // 近距離攻撃
                    if (Math.abs(dx) < 2 && Math.abs(dy) < 2 && Math.abs(dz) < 2 && Math.random() < 0.15) {
                        target.attack(12.5, 'mob');
                        target.addEffect('minecraft:levitation', 40, 1);
                    }
                }
                // ======== 技 ========
                if (entity.getTags().contains('mg_frenzy')) {
                    if (Math.random() < 0.10) worldDestruction(entity);
                    if (Math.random() < 0.20) purpleLightning(entity);
                    if (Math.random() < 0.15) slowAura(entity);
                } else {
                    if (Math.random() < 0.10) healSelf(entity);
                }
            }
        });
    });
});

// --- 死亡時ドロップ & ボスバー消去 ---
EntityEvents.death(event => {
    let entity = event.getEntity();
    if (entity.type == 'kubejs:murasaki_guardian') {
        event.level.server.runCommandSilent(`bossbar remove kubejs:murasaki_guardian`);
        let drops = event.getDrops();
        drops.clear();
        if (Math.random() < 0.3) drops.add(Item.of('kubejs:purple_thunder_crystal'));
        if (Math.random() < 0.4) drops.add(Item.of('minecraft:netherite_ingot', 2));
        if (Math.random() < 0.5) drops.add(Item.of('kubejs:demlight_ingot', 4));
        if (Math.random() < 0.6) drops.add(Item.of('kubejs:cutonetic_smithing_upgrade', 5));
        if (Math.random() < 0.7) drops.add(Item.of('kubejs:lightning_stinger'));
        if (Math.random() < 0.8) drops.add(Item.of('minecraft:emerald', 7));
        if (Math.random() < 0.8) drops.add(Item.of('kubejs:ancient_scroll'));
        drops.add(Item.of('kubejs:magical_soul')); // 100%固定
    }
});

// --- 技定義 ---
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

function purpleLightning(entity) {
    let x = entity.x, y = entity.y, z = entity.z;
    entity.level.spawnLightningBolt(x, y, z, false);
    entity.level.getEntitiesWithinAABB('minecraft:player', x-4, y-2, z-4, x+4, y+2, z+4).forEach(player => {
        player.attack(18, 'magic');
        player.addEffect('minecraft:glowing', 80, 1);
    });
}

function slowAura(entity) {
    let x = entity.x, y = entity.y, z = entity.z;
    entity.level.getEntitiesWithinAABB('minecraft:player', x-5, y-2, z-5, x+5, y+2, z+5).forEach(player => {
        player.addEffect('minecraft:slowness', 100, 2);
    });
    entity.level.spawnParticles('portal', x, y+1, z, 30, 1, 0.3, 1, 0.1);
}

function healSelf(entity) {
    if (entity.getHealth() < entity.getMaxHealth()) {
        entity.setHealth(entity.getHealth() + 12);
        entity.level.spawnParticles('happy_villager', entity.x, entity.y+1, entity.z, 15, 0.5, 0.3, 0.5, 0.05);
    }
}
