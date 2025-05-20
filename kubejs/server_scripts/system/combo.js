EntityEvents.hurt(event => {
  const attacker = event.source.entity
  const target = event.entity

  if (!attacker || !target || attacker == target) return

  const uuid = attacker.uuid
  const currentTime = event.level.time
  const last = comboMap.get(uuid) || { time: 0, combo: 0 }

  if (currentTime - last.time <= 20) {
    last.combo += 1
  } else {
    last.combo = 1
  }

  last.time = currentTime
  comboMap.set(uuid, last)

  // 連撃エンチャントの取得（最大Lv3想定）
  const weapon = attacker.mainHandItem
  const enchLevel = weapon?.nbt?.Enchantments?.find(e => e.id === "apotheosis:combo_mastery")?.lvl ?? 0

  // 通常倍率をベースに、エンチャントで倍率強化（例：1.125 + 0.05 * Lv）
  const base = 1.125 + 0.05 * enchLevel
  const multiplier = Math.pow(base, last.combo - 1)
  event.damage *= multiplier

  // 麻痺付与（変わらず）
  if (Math.random() < 0.15) {
    target.addEffect("lycanitesmobs:paralysis", 60, 0)
  }

  // attacker.tell(`Combo x${last.combo}, damage x${multiplier.toFixed(2)}`)
})
