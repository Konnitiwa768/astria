// server_scripts/special_sculk_full.js

// ========== 1. アイテム登録 ==========
StartupEvents.registry('item', event => {
  event.create('special_sculk')
    .displayName('§5特別なスカルク')
    .tooltip('右クリックで Warden & Parasites モード切替')
    .texture('kubejs:item/special_sculk') // テクスチャは resources に配置
})

// ========== 2. モード状態の読み込み ==========
let getMode = () => {
  return server.persistentData.get('wardenParasitesMode') ?? false
}
let setMode = (state) => {
  server.persistentData.put('wardenParasitesMode', state)
}

// ========== 3. コマンド /specialsculk ==========
ServerEvents.command(event => {
  event.register(
    event.literal('specialsculk').requires(s => true) // OP不要
    .executes(ctx => {
      const player = ctx.source.player
      const inv = player.inventory
      const hasItem = inv.contains(Item.of('kubejs:special_sculk'))

      if (hasItem) {
        player.tell('§eすでに特別なスカルクを所持しています。')
      } else {
        player.give(Item.of('kubejs:special_sculk'))
        player.tell('§a特別なスカルクを付与しました。')
      }

      return 1
    })
  )
})

// ========== 4. 使用時のトグル動作 ==========
ItemEvents.rightClicked(event => {
  const item = event.item
  const player = event.player

  if (item.id == 'kubejs:special_sculk') {
    let current = getMode()
    let newState = !current
    setMode(newState)

    player.const MODE_TAG = 'warden_and_parasites_mode'

// コマンドでモード切替
ServerEvents.commandRegistry(event => {
  const { commands: Commands, literal, playerArgument } = event

  event.register(
    literal('specialsculk')
      .requires(s => !s.hasPermission(4)) // OP不要
      .executes(ctx => {
        const player = ctx.source.player
        const held = player.mainHandItem

        if (held.isEmpty()) {
          const current = player.persistentData.get(MODE_TAG)
          const next = !current

          if (next) {
            player.give(Item.of('minecraft:sculk').withName(Component.literal('§9特別なスカルク')))
            player.tell('§aモードON: Warden and Parasites')
          } else {
            player.tell('§cモードOFF')
          }

          player.persistentData.putBoolean(MODE_TAG, next)
        } else {
          player.tell('§7手持ちが空いていないため、配布されませんでした')
        }

        return 1
      })
  )
})

// モブスポーン制御
EntityEvents.checkSpawn(event => {
  const type = event.entity.type
  const blockedEntities = [
    'kubejs:sculin',
    'kubejs:sulcon_lv1',
    'kubejs:scurpter',
    'kubejs:draizer',
    'kubejs:scane'
  ]

  if (blockedEntities.includes(type)) {
    const mode = event.level.persistentData.get(MODE_TAG)
    if (!mode) event.cancel()
  }
})
