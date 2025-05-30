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
        // 再生IIIを20tick(1秒)ごとに付与（効果時間は25tickで切れないように）
        player.addEffect("minecraft:regeneration", 25, 2, false, false) // レベル2(=再生III)
    }
})
