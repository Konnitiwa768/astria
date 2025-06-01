// KubeJS v6 LifeSteal（ライフスティール）エンチャント

// 1. エンチャント登録
StartupEvents.registry('enchantment', event => {
  event.create('life_steal')
    .displayName('ライフスティール')
    .maxLevel(5)
    .rarity('rare')
    .type('weapon')
})

// 2. 効果実装（攻撃ダメージの一定割合を回復、レベルで上昇）
EntityEvents.hurt(event => {
  let attacker = event.source.attacker
  if (!attacker || !attacker.mainHandItem) return

  let level = attacker.mainHandItem.enchantments['kubejs:life_steal'] || 0
  if (level <= 0) return

  // Lv1:30% Lv2:40% ... Lv5:70%（式で効率化）
  let healPercent = 0.2 + level * 0.1  // Lv1=0.3, Lv2=0.4 ... Lv5=0.7
  let heal = event.damage * healPercent

  // HP回復（最大HP超過しないように調整）
  let maxHp = attacker.maxHealth
  let newHp = Math.min(attacker.health + heal, maxHp)
  let actualHeal = newHp - attacker.health
  attacker.health = newHp

  // メッセージ表示（任意）
  if (actualHeal > 0) {
    attacker.sendMessage(`§cライフスティール！ +${actualHeal.toFixed(1)} HP`)
  }
})
