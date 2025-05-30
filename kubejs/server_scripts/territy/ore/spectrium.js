// ファイル: kubejs/server_scripts/territy/ore/spectrium.js

// 素材アイテム
StartupEvents.registry('item', event => {
    event.create('spectrium_ingot')
        .displayName('スペクトリウムインゴット')
        .texture('kubejs:item/spectrium_ingot')
})

// ツール・防具素材定義
StartupEvents.registry('tool_material', event => {
    event.create('spectrium')
        .durability(2200)       // ツール耐久値
        .level(6)               // 採掘レベル
        .speed(13)              // 掘る速度
        .attackDamageBonus(4)   // 剣用加算値
        .enchantmentValue(18)
        .repairIngredient('kubejs:spectrium_ingot')
})

StartupEvents.registry('armor_material', event => {
    event.create('spectrium')
        .durabilityMultiplier(48)            // 防具耐久倍率
        .slotProtections([4, 6, 8, 4])       // ダイヤと同値
        .enchantmentValue(18)
        .toughness(5)
        .knockbackResistance(0)
        .repairIngredient('kubejs:spectrium_ingot')
})

// ツール・防具アイテム登録
StartupEvents.registry('item', event => {
    // 剣
    event.create('spectrium_sword')
        .type('sword')
        .material('spectrium')
        .attackDamageBaseline(12) // 総攻撃力
        .displayName('スペクトリウムの剣')
        .texture('kubejs:item/spectrium_sword')

    // ピッケル
    event.create('spectrium_pickaxe')
        .type('pickaxe')
        .material('spectrium')
        .displayName('スペクトリウムのつるはし')
        .texture('kubejs:item/spectrium_pickaxe')

    // 防具
    event.create('spectrium_helmet')
        .type('helmet')
        .material('spectrium')
        .displayName('スペクトリウムヘルメット')
        .texture('kubejs:item/spectrium_helmet')
    event.create('spectrium_chestplate')
        .type('chestplate')
        .material('spectrium')
        .displayName('スペクトリウムチェストプレート')
        .texture('kubejs:item/spectrium_chestplate')
    event.create('spectrium_leggings')
        .type('leggings')
        .material('spectrium')
        .displayName('スペクトリウムレギンス')
        .texture('kubejs:item/spectrium_leggings')
    event.create('spectrium_boots')
        .type('boots')
        .material('spectrium')
        .displayName('スペクトリウムブーツ')
        .texture('kubejs:item/spectrium_boots')
})

// フルセットボーナス（再生III）付与
PlayerEvents.tick(event => {
    const player = event.player
    if (!player || player.isFake()) return

    // 装備判定
    const head = player.getEquipmentItem('head')?.id == 'kubejs:spectrium_helmet'
    const chest = player.getEquipmentItem('chest')?.id == 'kubejs:spectrium_chestplate'
    const legs = player.getEquipmentItem('legs')?.id == 'kubejs:spectrium_leggings'
    const feet = player.getEquipmentItem('feet')?.id == 'kubejs:spectrium_boots'

    if (head && chest && legs && feet) {
        // 再生// スペクトリウム鉱石追加
StartupEvents.registry('block', event => {
    event.create('spectrium_ore')
        .material('stone')
        .hardness(6)
        .resistance(12)
        .requiresTool(true)
        .tagBlock('mineable/pickaxe')
        .tagBlock('needs_tool_level_5') // 採掘レベル5
        .displayName('Spectrium Ore')
        .textureAll('kubejs:block/spectrium_ore')
})

// ドロップ用アイテム
StartupEvents.registry('item', event => {
    event.create('spectrium')
        .displayName('スペクトリウム')
        .texture('kubejs:item/spectrium')
    event.create('spectrium_ingot')
        .displayName('スペクトリウムインゴット')
        .texture('kubejs:item/spectrium_ingot')
})

// ツール・防具素材定義
StartupEvents.registry('tool_material', event => {
    event.create('spectrium')
        .durability(2200)
        .level(6)
        .speed(13)
        .attackDamageBonus(4)
        .enchantmentValue(18)
        .repairIngredient('kubejs:spectrium_ingot')
})

StartupEvents.registry('armor_material', event => {
    event.create('spectrium')
        .durabilityMultiplier(48)
        .slotProtections([3, 6, 8, 3])
        .enchantmentValue(18)
        .toughness(5)
        .knockbackResistance(0)
        .repairIngredient('kubejs:spectrium_ingot')
})

// ツール・防具
StartupEvents.registry('item', event => {
    event.create('spectrium_sword')
        .type('sword')
        .material('spectrium')
        .attackDamageBaseline(12)
        .displayName('スペクトリウムの剣')
        .texture('kubejs:item/spectrium_sword')

    event.create('spectrium_pickaxe')
        .type('pickaxe')
        .material('spectrium')
        .displayName('スペクトリウムのピッケル')
        .texture('kubejs:item/spectrium_pickaxe')

    event.create('spectrium_helmet')
        .type('helmet')
        .material('spectrium')
        .displayName('スペクトリウムヘルメット')
        .texture('kubejs:item/spectrium_helmet')
    event.create('spectrium_chestplate')
        .type('chestplate')
        .material('spectrium')
        .displayName('スペクトリウムチェストプレート')
        .texture('kubejs:item/spectrium_chestplate')
    event.create('spectrium_leggings')
        .type('leggings')
        .material('spectrium')
        .displayName('スペクトリウムレギンス')
        .texture('kubejs:item/spectrium_leggings')
    event.create('spectrium_boots')
        .type('boots')
        .material('spectrium')
        .displayName('スペクトリウムブーツ')
        .texture('kubejs:item/spectrium_boots')
})

// フルセットボーナス（再生III）
PlayerEvents.tick(event => {
    const player = event.player
    if (!player || player.isFake()) return

    const head = player.getEquipmentItem('head')?.id == 'kubejs:spectrium_helmet'
    const chest = player.getEquipmentItem('chest')?.id == 'kubejs:spectrium_chestplate'
    const legs = player.getEquipmentItem('legs')?.id == 'kubejs:spectrium_leggings'
    const feet = player.getEquipmentItem('feet')?.id == 'kubejs:spectrium_boots'

    if (head && chest && legs && feet) {
        player.addEffect("minecraft:regeneration", 25, 2, false, false)
    }
})

// スペクトリウムインゴットのクラフトレシピ
ServerEvents.recipes(event => {
    event.shapeless('kubejs:spectrium_ingot', [
        '4x kubejs:spectrium',
        '4x kubejs:demlight_scrap'
    ])
})

// ワールド生成（鉱石生成量や高さなどは適宜調整）
WorldgenEvents.add(event => {
    event.addOre(ore => {
        ore.block = 'kubejs:spectrium_ore'
        ore.spawnsIn.blacklist = false
        ore.spawnsIn.overworld = true
        ore.count = 10 // チャンクあたり生成量、デムライトより多め
        ore.size = 8
        ore.minY = 0
        ore.maxY = 32
        ore.chance = 1.0
        ore.requiresTool = true
    })
})
