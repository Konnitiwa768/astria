EntityEvents.spawned(event => {
  const mob = event.entity;
  
  // le の調整
  if (mob.type == 'aoa3:attercorpus') {
    mob.maxHealth = 46;
    mob.health = 46;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 7;
  }

  if (mob.type == 'aoa3:deinotherium') {
    mob.maxHealth = 120;
    mob.health = 120;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 9;
  }

  if (mob.type == 'aoa:spinoledon') {
    mob.maxHealth = 80;
    mob.health = 80;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 7;
  }

  if (mob.type == 'aoa3:veloraptor') {
    mob.maxHealth = 60;
    mob.health = 60;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 6;
  }

  if (mob.type == 'aoa3:scolopendis') {
    mob.maxHealth = 40;
    mob.health = 40;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 7;
  }

  // le の調整
  if (mob.type == 'aoa3:dunkleosteus') {
    mob.maxHealth = 30;
    mob.health = 30;

    // 遠距離攻撃はprojectileに依存するので、簡易的には攻撃力属性を変更
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 10;

    // より正確に調整するには発射物のカスタム処理が必要（別途対応可能）
  }
});
