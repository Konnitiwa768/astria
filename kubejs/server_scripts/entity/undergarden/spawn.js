// scripts/startup_scripts/spawn_eggs.js

StartupEvents.registry('item', event => {
  event.create('starfish_spawn_egg')
    .displayName('Starfish Spawn Egg')
    .maxStackSize(64)
    .properties(p => p.food(() => null)) // 食べ物ではないことを明示
    .unstackable(false)
    .rarity('common')
    .texture('kubejs:item/starfish_spawn_egg') // 任意のテクスチャを指定（後述）
    .tooltip('Spawns a Starfish')
    .spawnEgg('kubejs:starfish', 0xAA0000, 0xFF6666) // 赤ベース・薄赤スポット
})

  event.create('underrupter_spawn_egg')
    .displayName('Underrupter Spawn Egg')
    .maxStackSize(64)
    .properties(p => p.food(() => null))
    .unstackable(false)
    .rarity('common')
    .texture('kubejs:item/underrupter_spawn_egg')
    .tooltip('Spawns an Underrupter')
    .spawnEgg('kubejs:underrupter', 0x003300, 0x00AA00) // 黒緑ベース・黄緑スポット
})
