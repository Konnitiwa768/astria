// --- 武器の登録 ---
onEvent('item.registry', event => {
  event.create('crystavite')
    .type('sword')
    .displayName('Crystavite')
    .maxDamage(2048)
    .rarity(Rarity.EPIC)
    .attackDamageBaseline(28)
    .attackSpeedBaseline(0.6)
})

// --- レシピの追加 ---
onEvent('recipes', event => {
  event.shaped('kubejs:crystavite', [
    ' C ',
    ' D ',
    ' N '
  ], {
    C: 'minecraft:amethyst_shard',  // クリスタル的素材
    D: 'minecraft:diamond',
    N: 'minecraft:netherite_sword'
  })
})

// --- 連続攻撃によるダメージ強化処理 ---
let hitCounts = {}

onEvent('player.attackEntity', event => {
  let player = event.player
  let id = player.uuid

  // Crystaviteを持っていなければ無視
  if (player.mainHandItem.id != 'kubejs:crystavite') return

  let now = Date.now()
  if (!hitCounts[id]) {
    hitCounts[id] = { count: 1, lastHit: now }
  } else {
    let timeDiff = now - hitCounts[id].lastHit
    if (timeDiff < 2000) {
      hitCounts[id].count++
    } else {
      hitCounts[id].count = 1
    }
    hitCounts[id].lastHit = now
  }

  let bonus = Math.min(hitCounts[id].count - 2, 14)  // 最大+5ダメージ
  event.entity.attack(event.player, 28 + bonus)
  event.cancel() // 通常攻撃キャンセルして上書き
})
