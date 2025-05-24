// =============================
// 玄冥歪刃 - Genmei Wai Blade（1.16.5対応）
// 攻撃力15.5・速度1.75・特殊効果付きの大鎌（Spartan Weaponry）
// =============================

onEvent('recipes', event => {
  event.shaped('kubejs:genmei_wai_blade', [
    'NBO',
    ' N ',
    ' S '
  ], {
    O: 'minecraft:obsidian',
    N: 'minecraft:netherite_scrap',
    B: 'aoa3:baronyte_ingot',
    S: 'minecraft:stick'
  });
});

onEvent('item.registry', event => {
  event.create('genmei_wai_blade')
    .displayName('玄冥歪刃')
    .type('spartanweaponry:scythe') // Spartan Weaponry の大鎌
    .tier('netherite')
    .unstackable()
    .texture('kubejs:item/genmei_wai_blade')
    .attackDamageBaseline(15.5)
    .attackSpeedBaseline(1.75);
});

// 攻撃時の効果処理
onEvent('entity.hurt', event => {
  let source = event.source.entity;
  let target = event.entity;

  if (!source || !source.mainHandItem) return;
  if (source.mainHandItem.id != 'kubejs:genmei_wai_blade') return;

  let chance = Math.random();

  if (chance < 0.30) target.potionEffects.add('minecraft:blindness', 100, 0);  // 盲目5秒
  if (chance < 0.20) target.potionEffects.add('minecraft:nausea', 200, 0);     // 混乱10秒
  if (chance < 0.05) {
    target.potionEffects.add('minecraft:glowing', 60, 0);                      // 精神汚染（発光）
    source.tell(Text.of('§5[玄冥歪刃] §d精神が歪んだ気がする...'));
  }

  if (chance < 0.15) source.potionEffects.add('minecraft:hunger', 60, 0);      // 空腹（副作用）
  source.potionEffects.add('minecraft:regeneration', 40, 0);                   // 再生（常時）
});
