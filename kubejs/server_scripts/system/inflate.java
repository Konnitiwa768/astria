EntityEvents.hurt(event => {
  const entity = event.entity;
  if (!entity.isPlayer()) return;

  const atkBonus = entity.persistentData.getInt("atk_bonus") || 0;
  const defBonus = entity.persistentData.getInt("def_bonus") || 0;

  // ダメージ計算例：元ダメージを攻撃力補正で増加、防御力で減少
  let damage = event.amount;

  // 攻撃力を増加（たとえば＋10% per atkBonus/100）
  damage *= 1 + (atkBonus / 100);

  // 防御力を減少（たとえば−5% per defBonus/100）
  damage *= 1 - (defBonus / 200);

  // ダメージが0未満にならないように調整
  if (damage < 0) damage = 0;

  event.amount = damage;
});
