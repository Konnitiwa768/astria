// ポセイダイトアーマーを登録・レシピ追加
StartupEvents.registry('item', event => {
  const parts = ['helmet', 'chestplate', 'leggings', 'boots']
  parts.forEach(part => {
    event.create(`poseidite_${part}`)
      .displayName(`ポセイダイトの${translate(part)}`)
      .maxStackSize(1)
      .rarity('uncommon')
  })
})

ServerEvents.recipes(event => {
  event.shaped('armors:poseidite_helmet', [
    'PPP',
    'P P'
  ], {
    P: 'minecraft:prismarine'
  })

  event.shaped('armors:poseidite_chestplate', [
    'P P',
    'PPP',
    'PPP'
  ], {
    P: 'minecraft:prismarine'
  })

  event.shaped('armors:poseidite_leggings', [
    'PPP',
    'P P',
    'P P'
  ], {
    P: 'minecraft:prismarine'
  })

  event.shaped('armors:poseidite_boots', [
    'P P',
    'P P'
  ], {
    P: 'minecraft:prismarine'
  })
})

function translate(part) {
  switch (part) {
    case 'helmet': return '兜'
    case 'chestplate': return '胸当て'
    case 'leggings': return '脚甲'
    case 'boots': return '靴'
    default: return ''
  }
}
