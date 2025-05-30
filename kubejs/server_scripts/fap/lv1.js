// ======= モブ生成とエッグ登録 =======
EntityEvents.init(event => {
  const mobs = [
    { id: 'funguli', name: 'Funguli', egg: ['#eafff3', '#9effd2'] },
    { id: 'fungulimus', name: 'Fungulimus', egg: ['#e0ffc1', '#75a85b'] },
    { id: 'mushrooa', name: 'Mushrooa', egg: ['#b9ffdb', '#3e543c'] }
  ];

  for (const mob of mobs) {
    event.create(mob.id)
      .displayName(mob.name)
      .egg(mob.egg[0], mob.egg[1])
      .family('fungi')
      .trackingRange(32)
      .updateInterval(3)
      .fireImmune(false)
      .dimensions(0.6, 1.2)
      .defaultAttributes(attr => {
        attr.maxHealth = mob.id === 'funguli' ? 10 : mob.id === 'fungulimus' ? 20 : 30;
        attr.attackDamage = mob.id === 'funguli' ? 2 : mob.id === 'fungulimus' ? 4 : 7;
        attr.movementSpeed = 0.25;
      });
  }
});

// ======= スポーンルール =======
WorldgenEvents.add(event => {
  const ids = ['kubejs:funguli', 'kubejs:fungulimus', 'kubejs:mushrooa'];
  for (const id of ids) {
    event.addSpawn(event.worldgen.biomes, {
      type: 'monster',
      entity: id,
      weight: 8,
      minCount: 1,
      maxCount: 3
    });
  }
});

// ======= トグルによるスポーンキャンセル =======
EntityEvents.checkSpawn(event => {
  const entity = event.entity;
  if (!global.fungus_spawn_enabled && entity.getData('family') === 'fungi') {
    event.cancel();
  }
});

// ======= AIおよび能力 =======
EntityEvents.tick(event => {
  const entity = event.entity;
  const id = entity.type;

  if (id == 'kubejs:funguli') {
    entity.targetNearestPlayer(8);
    entity.lookAtTarget();
    entity.moveTowardTarget(1.0);
  }

  if (id == 'kubejs:fungulimus') {
    entity.targetNearestPlayer(10);
    entity.lookAtTarget();
    entity.moveTowardTarget(1.1);
    if (entity.age % 100 === 0) {
      entity.say('グルル…');
    }

    // 胞子爆発（鈍化エリア）
    if (entity.age % 200 === 0) {
      entity.level.playSound(null, entity.position(), 'minecraft:entity.pufferfish.blow_up', 'hostile', 1.0, 0.5);
      entity.level.spawnParticles('minecraft:spore_blossom_air', entity.x, entity.y + 1, entity.z, 20, 1, 1, 1, 0.05);
      entity.level.getEntitiesWithin(entity.boundingBox.inflate(3), e => e.isPlayer()).forEach(p => {
        p.potionEffects.add('minecraft:slowness', 60, 1);
      });
    }
  }

  if (id == 'kubejs:mushrooa') {
    entity.targetNearestPlayer(12);
    entity.lookAtTarget();
    entity.moveTowardTarget(1.2);
    if (entity.age % 80 === 0) {
      entity.playSound('minecraft:entity.elder_guardian.ambient', 1.0, 0.5);
    }

    // 吸引（5秒毎）
    if (entity.age % 100 === 0) {
      const range = 6;
      const players = entity.level.getEntitiesWithin(entity.boundingBox.inflate(range), e => e.isPlayer());
      for (const p of players) {
        const dx = entity.x - p.x;
        const dz = entity.z - p.z;
        const pull = 0.3;
        p.motion.set(p.motion.x + dx * pull, p.motion.y, p.motion.z + dz * pull);
        p.sendMessage('§5Mushrooaがあなたを引き寄せた…');
      }
    }
  }
});

// ======= 攻撃時の状態異常付与 =======
EntityEvents.hurt(event => {
  const { source, entity } = event;

  if (!source.attacker) return;
  const attacker = source.attacker;
  const target = entity;

  if (!attacker || !attacker.type) return;

  if (attacker.type == 'kubejs:funguli' && target.isPlayer()) {
    target.potionEffects.add('minecraft:slowness', 100, 0); // 5秒 スロウ1
  }

  if (attacker.type == 'kubejs:fungulimus' && target.isPlayer()) {
    target.potionEffects.add('minecraft:hunger', 200, 1); // 10秒 空腹2
  }

  if (attacker.type == 'kubejs:mushrooa' && target.isPlayer()) {
    target.potionEffects.add('minecraft:blindness', 60, 2); // 3秒 盲目3
    target.potionEffects.add('minecraft:slowness', 120, 1); // 6秒 スロウ2
  }
});
