onEvent('item.registry', event => {
  event.create('fire_duster')
    .displayName('§c炎纏塵')
    .type('sword')
    .attackDamageBaseline(13)
    .attackSpeedBaseline(1.6)
    .maxDamage(1000)
})

let comboMap = {}

onEvent('entity.attack', event => {
  const attacker = event.source.entity
  if (!attacker || !attacker.isPlayer()) return

  const weapon = attacker.getHeldItemMainhand()
  if (weapon.id != 'kubejs:fire_duster') return

  const uuid = attacker.uuid
  const gameTime = attacker.level.gameTime

  let combo = comboMap[uuid] || [1.0, gameTime]

  // コンボ時間切れ
  if (gameTime - combo[1] > 20) {
    combo[0] = 1.0
    attacker.tell(Text.of('§7[炎纏塵] §oコンボが消えた...'))
  }

  combo[0] += 0.08
  combo[1] = gameTime

  // ダメージと表示
  event.damage *= combo[0]
  attacker.tell(Text.of(`§c[炎纏塵] §fダメージ倍率：§e×${combo[0].toFixed(2)}`))

  // 延焼効果（4秒）
  event.entity.setOnFire(4)

  comboMap[uuid] = combo
})
