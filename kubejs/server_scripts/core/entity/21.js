EntityEvents.spawned(event => {
  const mob = event.entity;
  
  // le の調整
  if (mob.type == 'aoa3:arcbeast') {
    mob.maxHealth = 192;
    mob.health = 192;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 22;
  }

  if (mob.type == 'aoa3:arcworm') {
    mob.maxHealth = 188;
    mob.health = 188;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 18;
  }

  if (mob.type == 'aoa:axiolight') {
    mob.maxHealth = 171;
    mob.health = 171;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 24;
  }

  if (mob.type == 'aoa3:lightwalker') {
    mob.maxHealth = 190;
    mob.health = 190;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 23;
  }

  if (mob.type == 'aoa3:luxocron') {
    mob.maxHealth = 202;
    mob.health = 202;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 16;
  }

  // le の調整
  if (mob.type == 'aoa3:omnilight') {
    mob.maxHealth = 174;
    mob.health = 174;

    // 遠距離攻撃はprojectileに依存するので、簡易的には攻撃力属性を変更
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 20;

    // より正確に調整するには発射物のカスタム処理が必要（別途対応可能）
  if (mob.type == 'aoa3:shyre_knight') {
    mob.maxHealth = 156;
    mob.health = 156;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 20;
  }
  if (mob.type == 'aoa3:soulscorne') {
    mob.maxHealth = 165;
    mob.health = 165;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 28;
  }
　if (mob.type == 'aoa3:soulvyre') {
    mob.maxHealth = 235;
    mob.health = 235;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 14;
  }
 if (mob.type == 'aoa3:stimulo) {
    mob.maxHealth = 212;
    mob.health = 212;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 15;
  }
 if (mob.type == 'aoa3:stimulosus') {
    mob.maxHealth = 224;
    mob.health = 224;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 17.5;
  }
 if (mob.type == 'aoa3:sysker") {
    mob.maxHealth = 150;
    mob.health = 150;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 37;
  }

  }
});
