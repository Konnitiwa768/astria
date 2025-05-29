// server_scripts/phase4_mobs.js

StartupEvents.registry('entity_type', event => {
  event.create('dark_bomber').category('monster').size(0.9, 1.8).trackingRange(64)
  event.create('sulcon_lv2').category('monster').size(0.9, 1.8).trackingRange(64)
  event.create('scultoxic').category('monster').size(0.9, 1.8).trackingRange(64)
})

EntityEvents.spawned(event => {
  const e = event.entity
  if (!e) return

  if (e.type == 'kubejs:dark_bomber') {
    e.customName = Text.of('§cDark Bomber')
    e.maxHealth = 85
    e.health = 85
    e.setNoGravity(true)
    e.persistent = true
    e.getAttribute('minecraft:armor').baseValue = 7

    let tick = 0
    event.server.scheduleInTicks(5, function loop() {
      if (!e.isAlive()) return
      tick++
      if (tick % 100 == 0) {
        const pos = e.position()
        e.level.explode(pos.x, pos.y, pos.z, 3, false)
      }
      event.server.scheduleInTicks(5, loop)
    })
  }

  if (e.type == 'kubejs:sulcon_lv2') {
    e.customName = Text.of('§6Sulcon Lv.2')
    e.maxHealth = 90
    e.health = 90
    e.persistent = true
    e.getAttribute('minecraft:armor').baseValue = 5

    let summoned = false
    event.server.scheduleInTicks(10, function loop() {
      if (!e.isAlive()) return
      const allies = e.level.getEntitiesWithin(AABB.of(e.position(), 10, 10, 10), x =>
        x.isLiving() && x.isAllyTo(e) && x != e
      )
      allies.forEach(x => x.addEffect('minecraft:strength', 100, 1, false, false))

      if (!summoned && e.health <= 45) {
        summoned = true
        for (let i = 0; i < 3; i++) {
          const list = ['kubejs:dark_bomber', 'kubejs:scane', 'kubejs:scultoxic']
          const pick = list[Math.floor(Math.random() * list.length)]
          e.server.runCommandSilent(`summon ${pick} ~ ~ ~`)
        }
      }
      event.server.scheduleInTicks(10, loop)
    })
  }

  if (e.type == 'kubejs:scultoxic') {
    e.customName = Text.of('§2Scultoxic')
    e.maxHealth = 64
    e.health = 64
    e.persistent = true
    e.getAttribute('minecraft:movement_speed').baseValue = 0.45
    e.getAttribute('minecraft:attack_damage').baseValue = 5
    e.getAttribute('minecraft:attack_speed').baseValue = 1.6

    e.onHurt(evt => {
      if (!e.persistentData.cooldown || e.persistentData.cooldown < event.level.time) {
        e.persistentData.cooldown = event.level.time + 200
        e.level.playSound(null, e.blockX, e.blockY, e.blockZ, 'minecraft:entity.generic.explode', 1, 1.5)
        e.addEffect('minecraft:invisibility', 60, 0, false, false)
        e.spawnParticles('minecraft:cloud', 20)
      }
    })

    e.onAttack(evt => {
      if (evt.target && evt.target.isLiving()) {
        evt.target.addEffect('minecraft:poison', 100, 0, false, true)
      }
    })
  }
})

EntityAIEvent.add(event => {
  const e = event.entity
  if (e.type == 'kubejs:dark_bomber') {
    event.addGoal(1, 'minecraft:look_at_player', { max_distance: 32 })
    event.addGoal(2, 'minecraft:look_randomly', {})
    event.addGoal(3, 'minecraft:random_stroll_fly', { speed: 1.0 })
    event.addTargetGoal(1, 'minecraft:nearest_attackable_target', { target: 'minecraft:player' })
  }

  if (e.type == 'kubejs:sulcon_lv2') {
    event.addGoal(1, 'minecraft:melee_attack', { speed: 1.0, pause_when_idle: false })
    event.addGoal(2, 'minecraft:look_at_player', { max_distance: 16 })
    event.addGoal(3, 'minecraft:look_randomly', {})
    event.addGoal(4, 'minecraft:water_avoiding_random_stroll', { speed: 0.8 })
    event.addTargetGoal(1, 'minecraft:nearest_attackable_target', { target: 'minecraft:player' })
  }

  if (e.type == 'kubejs:scultoxic') {
    event.addGoal(1, 'minecraft:melee_attack', { speed: 1.2, pause_when_idle: false })
    event.addGoal(2, 'minecraft:avoid_entity', {
      entity_types: ['minecraft:iron_golem', 'minecraft:wolf'],
      distance: 6,
      walk_speed_modifier: 1.0,
      sprint_speed_modifier: 1.3
    })
    event.addGoal(3, 'minecraft:look_at_player', { max_distance: 16 })
    event.addGoal(4, 'minecraft:look_randomly', {})
    event.addGoal(5, 'minecraft:water_avoiding_random_stroll', { speed: 1.0 })
    event.addTargetGoal(1, 'minecraft:nearest_attackable_target', { target: 'minecraft:player' })
  }
})
