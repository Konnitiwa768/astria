EntityEvents.spawned(event => {
  const mob = event.entity;
  
  // Cadillion の調整
  if (mob.type == 'divinerpg:eden_cadillion') {
    mob.maxHealth = 85;
    mob.health = 85;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 7;
  }

  // Madivel の調整
  if (mob.type == 'divinerpg:madivel') {
    mob.maxHealth = 180;
    mob.health = 180;

    // 遠距離攻撃はprojectileに依存するので、簡易的には攻撃力属性を変更
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 12;

    // より正確に調整するには発射物のカスタム処理が必要（別途対応可能）
  }
});
