PlayerEvents.death(event => {
  const player = event.player
  const inventory = player.inventory

  // プレイヤーの装備アイテムすべてをチェック
  const hasTotemEnchant = [
    player.mainHandItem,
    player.offHandItem,
    player.getEquipmentItem("head"),
    player.getEquipmentItem("chest"),
    player.getEquipmentItem("legs"),
    player.getEquipmentItem("feet")
  ].some(item => item?.nbt?.Enchantments?.some(e => e.id === "mymod:totem_of_revival"))

  if (!hasTotemEnchant) return

  // 金5個 + エメラルド1個があるかチェック
  const hasEnoughGold = inventory.count(Item.of("minecraft:gold_ingot")) >= 5
  const hasEmerald = inventory.count(Item.of("minecraft:emerald")) >= 1

  if (hasEnoughGold && hasEmerald) {
    // 消費
    inventory.remove(Item.of("minecraft:gold_ingot"), 5)
    inventory.remove(Item.of("minecraft:emerald"), 1)

    // 死亡キャンセル & HP 1で復活
    event.cancel()
    player.setHealth(2.0) // HP 1

    // 無敵効果
    player.addEffect("minecraft:resistance", 100, 4)
    player.addEffect("minecraft:regeneration", 100, 1)

    // メッセージ表示
    player.tell("§6復活トーテムがあなたを救った！")
  }
})
