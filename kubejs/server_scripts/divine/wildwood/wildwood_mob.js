EntityEvents.spawned(event => {
  const mob = event.entity;
  
  // Cadillion の調整
  if (mob.type == 'divinerpg:wildwood_cadillion') {
    mob.maxHealth = 98;
    mob.health = 98;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 9;
  }
  // Golemの調整
  if (mob.type == 'divinerpg:wildwood_golem') {
    mob.maxHealth = 175;
    mob.health = 175;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 17;
  }
  // Madivel の調整
  if (mob.type == 'divinerpg:verek') {
    mob.maxHealth = 86;
    mob.health = 86;

    // 遠距離攻撃はprojectileに依存するので、簡易的には攻撃力属性を変更
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 8;

    // より正確に調整するには発射物のカスタム処理が必要（別途対応可能）
  }
});
