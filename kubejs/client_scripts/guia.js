// ====== GUI定義 ======
ServerEvents.recipes(event => {
  event.custom({
    type: 'kubejs:ui_menu',
    id: 'kubejs:hpgui',
    title: 'HPレベルアップ',
    size: [9, 3], // 9列×3行
    items: Array.from({ length: 27 }, (_, i) => ({
      slot: i,
      item: {
        id: 'minecraft:emerald',
        count: 1,
        tag: {
          display: {
            Name: JSON.stringify({ text: `HP Lv${i + 1}`, color: 'green' })
          }
        }
      }
    }))
  });
});
