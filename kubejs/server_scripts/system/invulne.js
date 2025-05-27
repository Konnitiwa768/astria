// KubeJS v6 (1.19.2)
PlayerEvents.hurt(event => {
  // プレイヤーの場合
  event.player.invulnerableTime = 0
});

EntityEvents.hurt(event => {
  // すべてのエンティティに適用したい場合
  event.entity.invulnerableTime = 0
});
