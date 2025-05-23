// KubeJS - on hurt, reflect damage if reflective effect is active
ServerEvents.generic((event) => {
  if (event instanceof net.minecraftforge.event.entity.living.LivingHurtEvent) {
    let target = event.getEntity();
    let source = event.getSource().getEntity();

    if (!target || !source || target == source) return;
    if (!(target instanceof net.minecraft.world.entity.LivingEntity)) return;
    if (!(source instanceof net.minecraft.world.entity.LivingEntity)) return;

    let effect = target.getEffect(Java.loadClass("net.minecraft.world.effect.MobEffects").byId("kubejs:reflective"));
    if (!effect) return;

    let level = effect.getAmplifier() + 1; // 0-based → 1-based
    let multiplier = 0.25 * level;
    let reflectDamage = event.getAmount() * multiplier;

    source.hurt(
      Java.loadClass("net.minecraft.world.damagesource.DamageSource").thorns(target),
      reflectDamage
    );
  }
});
