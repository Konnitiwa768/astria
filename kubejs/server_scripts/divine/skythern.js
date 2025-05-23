EntityEvents.spawned(event => {
  const mob = event.entity;
  
  // Cadillion の調整
  if (mob.type == 'divinerpg:samek') {
    mob.maxHealth = 161;
    mob.health = 161;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 14;
  }
  // Golemの調整
  if (mob.type == 'divinerpg:skythern_golem') {
    mob.maxHealth = 292;
    mob.health = 292;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 25;
  }
  //  の調整
  if (mob.type == 'divinerpg:skythern_fiend') {
    mob.maxHealth = 80;
    mob.health = 80;

    // 遠距離攻撃はprojectileに依存するので、簡易的には攻撃力属性を変更
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 19;

    // より正確に調整するには発射物のカスタム処理が必要（別途対応可能）
  }
});
