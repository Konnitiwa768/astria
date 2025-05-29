// startup_scripts/entities.js

StartupEvents.registry('entity_type', event => {
  event.create('sculin')
    .displayName('スクリン')
    .egg((0x00aa00), (0xffffff))
    .size(0.4, 0.5)
    .health(5)
    .ai(true)
    .spawnGroup('creature')
    .updateInterval(3)
    .stepHeight(1)
    .category('creature')

  event.create('scurpter')
    .displayName('スカルプター')
    .egg((0x00aaaa), (0x000000))
    .size(0.8, 1.4)
    .health(10)
    .armor(5)
    .damage(3, 4, 6)
    .speed(0.41)
    .ai(true)
    .attack(true)
    .category('monster')
})
// server_scripts/entities/sculin_and_scurpter.js

EntityEvents.spawned(event => {
  if (event.entity.type == 'kubejs:sculin') {
    event.entity.persistentData.set('grassEaten', 0)
  }
})

EntityEvents.tick(event => {
  const entity = event.entity

  // Sculinの草食い処理
  if (entity.type == 'kubejs:sculin') {
    if (entity.isOnGround() && entity.level.random.nextFloat() < 0.01) {
      const below = entity.blockPosition().below()
      if (entity.level.getBlockState(below).block == 'minecraft:grass_block') {
        entity.level.setBlock(below, 'minecraft:dirt') // 草を食べる
        let eaten = entity.persistentData.get('grassEaten') ?? 0
        entity.persistentData.set('grassEaten', eaten + 1)
        entity.playSound('minecraft:entity.generic.eat', 1, 1)

        // 一定数食べたらscurpterに変化
        if (eaten + 1 >= 5) {
          entity.kill()
          entity.level.spawnEntity('kubejs:scurpter', entity.x, entity.y, entity.z)
        }
      }
    }
  }

  // Scurpterの協力・攻撃AI
  if (entity.type == 'kubejs:scurpter') {
    const nearby = entity.level.getEntitiesWithin(AABB.of(entity, 16, 4, 16))
    nearby.forEach(e => {
      if (e.type == 'kubejs:scurpter' && e.id != entity.id) {
        entity.getNavigation().moveTo(e, 1.0) // 仲間の方へ移動
      } else if (e.isMob() && !e.isAlliedTo(entity) && e.type.namespace != 'kubejs') {
        entity.setTarget(e)
      }
    })
  }
})
