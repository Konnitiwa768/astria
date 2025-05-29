// server_scripts/entities/kyrphos.js

StartupEvents.registry('entity_type', event => {
    event.create('kyrphos')
        .category('monster')
        .size(0.8, 2.4)
        .trackingRange(64)
        .updateInterval(3)
        .clientTrackingRange(32)
        .fireImmune(false)
        .egg((base) => {
            base.primary(0x3a3a3a) // 灰色ベース
            base.secondary(0x92ff6a) // 緑がかった差し色
        })
        .defaultAttributes((entity, attr) => {
            attr.add('generic.max_health', 80)
            attr.add('generic.attack_damage', 10)
            attr.add('generic.knockback_resistance', 0.2)
            attr.add('generic.movement_speed', 0.27)
            attr.add('generic.attack_knockback', 2.0)
            attr.add('generic.follow_range', 35)
        })
})

// --- AI・近接戦・防具貫通 ---
EntityEvents.spawned(event => {
    const entity = event.entity
    if (entity.type == 'kubejs:kyrphos') {
        entity.addTag('kyrphos_ai')
        entity.goalSelector.addGoal(1, 'minecraft:melee_attack', { speed: 1.2, pauseWhenMobIdle: false })
        entity.goalSelector.addGoal(2, 'minecraft:look_at_player', { distance: 8 })
        entity.goalSelector.addGoal(3, 'minecraft:random_look_around')
        entity.targetSelector.addGoal(1, 'minecraft:nearest_attackable_target', { target: 'minecraft:player' })
    }
})

EntityEvents.hurt(event => {
    const attacker = event.source.entity
    const target = event.entity

    if (attacker && attacker.type == 'kubejs:kyrphos' && target.isLiving()) {
        if (Math.random() < 0.25) {
            const rawDamage = 10
            const armor = target.getArmorValue()
            const reduced = armor * 0.04
            const bypassDamage = rawDamage * reduced
            target.hurt(DamageSource.mobAttack(attacker), bypassDamage)
        }
    }
})
