StartupEvents.registry('mob_spawn_settings', event => {
  event.addCustomSpawn((ctx) => {
    const players = ctx.server.getPlayerList().players;
    const unlocked = players.some(player => player.persistentData.phase4_unlocked);

    if (!unlocked) return;

    // ワールドに解放されたPhase4モブのスポーン設定
    ctx.addSpawn("kubejs:dark_bomber", {
      category: "monster",
      weight: 10,
      minCount: 1,
      maxCount: 1,
      biomes: ["minecraft:desert", "minecraft:soul_sand_valley"],
      conditions: { canSeeSky: true }
    });

    ctx.addSpawn("kubejs:sulcon_lv2", {
      category: "monster",
      weight: 8,
      minCount: 1,
      maxCount: 1,
      biomes: ["minecraft:basalt_deltas", "minecraft:windswept_hills"],
      conditions: { maxLightLevel: 7 }
    });

    ctx.addSpawn("kubejs:scultoxic", {
      category: "monster",
      weight: 12,
      minCount: 1,
      maxCount: 4,
      biomes: ["minecraft:jungle", "minecraft:swamp"],
      conditions: { isDarkEnoughToSpawn: true }
    });
  });
});
let killCount = {};

ServerEvents.entityKilled(event => {
  const entity = event.entity;
  const source = event.source;

  if (!source.player) return;
  const player = source.player;

  const type = entity.type;
  if (type != 'kubejs:scane' && type != 'kubejs:draizer') return;

  const uuid = player.uuid;
  if (!killCount[uuid]) killCount[uuid] = 0;

  killCount[uuid]++;

  player.tell(`Phase4 Kill Count: ${killCount[uuid]} / 75`);

  // 75撃破後にフラグを立てる
  if (killCount[uuid] >= 75 && !player.persistentData.phase4_unlocked) {
    player.persistentData.phase4_unlocked = true;
    player.tell("§l§cPhase 4のモブが世界に解き放たれた…！");
  }
});
