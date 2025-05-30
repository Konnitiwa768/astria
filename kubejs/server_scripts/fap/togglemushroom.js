// ========== グローバル状態 ==========
global.fungus_spawn_enabled = true; // 初期状態: ON（スポーン許可）

// ========== 特別なキノコアイテムの登録 ==========
ItemEvents.registry(event => {
  event.create('toggle_mushroom')
    .displayName('§d菌糸トグルマッシュルーム')
    .tooltip('右クリックで菌糸の発生をトグルします')
    .food(food => food.hunger(8).saturation(8).alwaysEdible());
});

// ========== プレイヤーがトグルキノコを右クリックしたとき ==========
PlayerEvents.rightClicked(event => {
  const item = event.item;
  if (!item || item.id != 'kubejs:toggle_mushroom') return;

  global.fungus_spawn_enabled = !global.fungus_spawn_enabled;

  const status = global.fungus_spawn_enabled ? '§aON（スポーン許可）' : '§cOFF（スポーン停止）';
  event.player.tell(`§6[fungus_and_parasites] 菌糸スポーン状態: ${status}`);
  event.player.playSound('minecraft:ui.button.click', 1.0, 1.0);
});

// ========== スポーンをキャンセル（family=fungi） ==========
EntityEvents.checkSpawn(event => {
  const entity = event.entity;
  if (!global.fungus_spawn_enabled && entity.getData('family') === 'fungi') {
    event.cancel();
  }
});

// ========== 特別なキノコを取得するコマンド（OP不要） ==========
ServerEvents.commandRegistry(event => {
  const { commands } = event;

  event.register(commands.literal('getfunguskey')
    .executes(ctx => {
      const player = ctx.source.player;
      player.give(Item.of('kubejs:toggle_mushroom'));
      ctx.source.sendSuccess(Text.of('§a[fungus_and_parasites] トグルマッシュルームを付与しました'), false);
      return 1;
    })
  );
});
