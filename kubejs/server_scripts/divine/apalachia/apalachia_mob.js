EntityEvents.spawned(event => {
  const mob = event.entity;
  
  // Cadillion の調整
  if (mob.type == 'divinerpg:apalachia_cadillion') {
    mob.maxHealth = 112;
    mob.health = 112;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 11;
  }
  // Golemの調整
  if (mob.type == 'divinerpg:apalachia_golem') {
    mob.maxHealth = 235;
    mob.health = 235;
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 22;
  }
  //  の調整
  if (mob.type == 'divinerpg:apalachia_tomo') {
    mob.maxHealth = 122;
    mob.health = 122;

    // 遠距離攻撃はprojectileに依存するので、簡易的には攻撃力属性を変更
    mob.getAttribute("minecraft:generic.attack_damage").baseValue = 8;

    // より正確に調整するには発射物のカスタム処理が必要（別途対応可能）
  }
});
