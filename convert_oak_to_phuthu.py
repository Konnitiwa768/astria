from PIL import Image
import os
import glob

# 色変換のパラメータ
TINT_COLOR = (117, 61, 207, 128)  # #753dcf, alpha 128
OUTPUT_DIR = "resourcepack/assets/kubejs/textures/block"

os.makedirs(OUTPUT_DIR, exist_ok=True)

for file in glob.glob("*.png"):
    with Image.open(file).convert("RGBA") as img:
        tint = Image.new("RGBA", img.size, TINT_COLOR)
        blended = Image.alpha_composite(img, tint)
        outname = os.path.join(OUTPUT_DIR, "phuthu_" + file)
        blended.save(outname)
        print(f"Processed {file} -> {outname}")
