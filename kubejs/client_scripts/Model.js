// server_scripts/auto_model_export.js
// このスクリプトは全アイテムIDのリストをログに出力し、
// 各アイテムのモデルjson生成用データを作ります

onEvent('server.datapack.high_priority', event => {
    let items = Item.getAll()
    items.forEach(item => {
        let id = item.id // 例: minecraft:diamond
        // ここでファイル書き出しや、json生成を行いたい場合は
        // 追加のNode.jsスクリプトやKubeJSのResourcePack APIを使います
        // 例: event.addJson(`assets/${id.namespace}/models/item/${id.path}.json`, {...})
        event.addJson(`assets/${id.namespace}/models/item/${id.path}.json`, {
            "parent": "item/generated",
            "textures": {
                "layer0": `${id.namespace}:item/${id.path}`
            }
        })
    })
})
