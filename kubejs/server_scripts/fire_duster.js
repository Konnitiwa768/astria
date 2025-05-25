ServerEvents.itemRegistry(event => {
  event.create('fire_duster')
    .displayName('§c炎織塵')
    .type('sword')
    .attackDamageBaseline(13)
    .attackSpeedBaseline(1.6)
    .maxDamage(5120); //抜刀剣風
});

const comboMap = {};

EntityEvents.hurt(event => {
  const attacker = event.source.entity;
  if (!attacker || !attacker.isPlayer?.()) return;

  const weapon = attacker.mainHandItem;
  if (!weapon || weapon.id !== 'kubejs:fire_duster') return;

  const uuid = attacker.uuid;
  const gameTime = attacker.level.gameTime;

  let combo = comboMap[uuid] || [1.0, gameTime];

  // コンボ時間切れ
  if (gameTime - combo[1] > 20) {
    combo[0] = 1.0;
    if (attacker.tell) attacker.tell(Text.of('§7[炎織塵] §oコンボが消えた...'));
  }

  combo[0] += 0.08;
  combo[1] = gameTime;

  // ダメージと表示
  event.damage *= combo[0];
  if (attacker.tell) attacker.tell(Text.of(`§c[炎織塵] §fダメージ倍率：§e×${combo[0].toFixed(2)}`));

  // 延焼効果（4秒）
  if (event.entity.setOnFire) event.entity.setOnFire(4);

  comboMap[uuid] = combo;
});
