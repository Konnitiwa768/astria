// スカルトキシック ボス実装 (kubejs v6/Battlity対応)
// 召喚・タグ・AI・HP同期・特殊攻撃・ドロップ全て含む

// HP半分かつダイヤ右クリックで本気モード
let scultoxicFrenzy = {};

PlayerEvents.rightClickEntity(event => {
    let entity = event.target;
    if (entity.type == 'kubejs:scultoxic' && entity.getHealth() <= 512 && !entity.getTags().contains('scultoxic_frenzy')) {
        if (event.item.id === 'minecraft:diamond') {
            entity.addTag('scultoxic_frenzy');
            event.player.tell(Text.red('Scultoxicが本気を出した！'));
            event.item.shrink(1);
            entity.level.server.runCommandSilent(
                `bossbar set kubejs:scultoxic color red`
            );
        }
    }
});

// ボス召喚例（ここは好きな方法で）
ServerEvents.command(event => {
    if (event.command === "/summon_scultoxic") {
        let pos = event.player.position();
        event.server.runCommandSilent(
          `summon kubejs:scultoxic ${pos.x} ${pos.y} ${pos.z} {CustomName:'{"text":"Scultoxic"}'}`
        );
        event.server.runCommandSilent(
          `bossbar add kubejs:scultoxic {"text":"Scultoxic"}`
        );
        event.server.runCommandSilent(
          `bossbar set kubejs:scultoxic max 1024`
        );
        event.server.runCommandSilent(
          `bossbar set kubejs:scultoxic value 1024`
        );
        event.server.runCommandSilent(
          `bossbar set kubejs:scultoxic visible true`
        );
    }
});

// HP・AI同期
ServerEvents.tick(event => {
    event.server.getAllLevels().forEach(level => {
        level.getEntities().forEach(entity => {
            if (entity.type == 'kubejs:scultoxic') {
                entity.setMaxHealth(1024);
                entity.setHealth(Math.min(entity.getHealth(), 1024));
                entity.setMovementSpeed(1.6);
                entity.setAttackDamage(11);
                entity.addTag('boss');
                // ボスバー HP同期
                event.server.runCommandSilent(
                  `bossbar set kubejs:scultoxic value ${Math.floor(entity.getHealth())}`
                );
                // 本気モード時: 特殊AI
                if (entity.getTags().contains('scultoxic_frenzy')) {
                    // 炎レーザー: 15%の確率で発動
                    if (Math.random() < 0.15) fireLaser(entity);
                    // 大ジャンプ: 10%の確率で発動
                    if (Math.random() < 0.10) bigJump(entity);
                }
            }
        });
    });
});

// 死亡時ドロップ & ボスバー消去
EntityEvents.death(event => {
    let entity = event.getEntity();
    if (entity.type == 'kubejs:scultoxic') {
        event.level.server.runCommandSilent(`bossbar remove kubejs:scultoxic`);
        let drops = event.getDrops();
        drops.clear();
        // 28%: supernova_stinger 1個
        if (Math.random() < 0.28) drops.add(Item.of('kubejs:supernova_stinger'));
        // 80%: プロヴァームアップロード 1個
        if (Math.random() < 0.51) drops.add(Item.of('kubejs:provarm_smithing_upgrade', 3));
        // 70%: spectrium 2個
        if (Math.random() < 0.7) drops.add(Item.of('kubejs:spectrium', 2));
        // 50%: demlight 4個
        if (Math.random() < 0.5) drops.add(Item.of('kubejs:demlight', 4));
        // 30%: netherite ingot 1個
        if (Math.random() < 0.3) drops.add(Item.of('minecraft:netherite_ingot'));
        // 80%: gold ingot 6個
        if (Math.random() < 0.8) drops.add(Item.of('minecraft:gold_ingot', 6));
        // 80%: quartz 12個
        if (Math.random() < 0.8) drops.add(Item.of('minecraft:quartz', 12));
        // 100%: amethyst_halberd 1個
        drops.add(Item.of('kubejs:amethyst_halberd'));
    }
});

// 炎レーザー（火パーティクル+範囲ダメージ）
function fireLaser(entity) {
    let look = entity.getLookVec();
    let x = entity.x + look.x * 4;
    let y = entity.y + 1.2;
    let z = entity.z + look.z * 4;
    entity.level.spawnParticles('flame', x, y, z, 50, 1, 0.2, 1, 0.04);
    entity.level.getEntitiesWithinAABB('minecraft:player', x-2, y-2, z-2, x+2, y+2, z+2).forEach(player => {
        player.attack(11, 'fire');
        player.setOnFire(2);
    });
}

// 大ジャンプ→着地時プレイヤーに30ダメ+スロー
function bigJump(entity) {
    entity.setMotion(entity.motion.x, 1.35, entity.motion.z);
    entity.server.scheduleInTicks(22, () => {
        entity.level.getEntitiesWithinAABB('minecraft:player', entity.x-2, entity.y-2, entity.z-2, entity.x+2, entity.y+1, entity.z+2).forEach(player => {
            player.attack(30, 'mob');
            player.addEffect('minecraft:slowness', 60, 1);
        });
        entity.level.spawnParticles('cloud', entity.x, entity.y, entity.z, 40, 1, 0.7, 1, 0.15);
    });
}
