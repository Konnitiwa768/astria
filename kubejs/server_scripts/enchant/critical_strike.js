// KubeJS v6 会心の一撃エンチャント（式で効率化バージョン）
StartupEvents.registry('enchantment', event => {
  event.create('critical_strike')
    .displayName('会心の一撃')
    .maxLevel(5)
    .rarity('epic')
    .type('weapon')
})

// 発動確率・倍率を式で計算
// 例: chances = 0.04 + lv*0.04（Lv1:8%, Lv5:24%）
//     multipliers = 1.3 + lv*0.35（Lv1:1.65倍, Lv5:2.05倍 など自由に調整可）

EntityEvents.hurt(event => {
  let attacker = event.source.attacker
  if (!attacker || !attacker.mainHandItem) return
  let level = attacker.mainHandItem.enchantments['kubejs:critical_strike'] || 0
  if (level <= 0) return

  // 1～5レベル対応
  // 発動確率式例: 0.04 + (level * 0.04) → Lv1:8%, Lv5:24%
  let chance = 0.025 + (level * 0.025)
  // ダメージ倍率式例: 1.2 + (level * 0.35) → Lv1:1.55倍, Lv5:1.95倍
  let multiplier = (2 * (0.15 * level ) + (level * 0.15)

  if (Math.random() < chance) {
    let extra = event.damage * (multiplier - 1)
    event.damage += extra
    attacker.sendMessage('§e会心の一撃！')
    // パーティクルや音も追加可能
  }
})
