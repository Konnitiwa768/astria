EntityEvents.spawned(event => {
  const mob = event.entity;
  
  // le の調整
  if (mob.type == 'aoa3:lelyetian_warrior') {
    mob.maxHealth = 56;
    mob.health = 56;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 4;
  }

  if (mob.type == 'aoa3:paravite') {
    mob.maxHealth = 67;
    mob.health = 67;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 3.5;
  }

  if (mob.type == 'aoa3:rawbone') {
    mob.maxHealth = 52;
    mob.health = 52;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 5.6;
  }

  if (mob.type == 'aoa3:exohead') {
    mob.maxHealth = 66;
    mob.health = 66;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 5;
  }

  if (mob.type == 'aoa3:flye') {
    mob.maxHealth = 48;
    mob.health = 48;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 7;
  }

  // le の調整
  if (mob.type == 'aoa3:zhinx') {
    mob.maxHealth = 45;
    mob.health = 45;

    // 遠距離攻撃はprojectileに依存するので、簡易的には攻撃力属性を変更
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 5;

    // より正確に調整するには発射物のカスタム処理が必要（別途対応可能）
  }
});
