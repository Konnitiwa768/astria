import os
import requests
from PIL import Image

OAK_FILES = [
    "oak_planks.png",
    "oak_stripped_log.png",
    "oak_stripped_wood.png",
    "oak_wood.png",
    "oak_door.png",
    "oak_trapdoor.png",
    "oak_pressure_plate.png",
    "oak_button.png",
    "oak_fence.png",
    "oak_fence_gate.png",
    "oak_stairs.png",
    "oak_slab.png",
    "oak_sign.png",
    "oak_boat.png",
    "oak_hanging_sign.png",
    "oak_sapling.png"
]

DEST_DIR = "resourcepack/assets/kubejs/textures/block"
SRC_URL = "https://raw.githubusercontent.com/Mojang/bedrock-samples/refs/heads/main/resource_pack/textures/blocks/"

os.makedirs(DEST_DIR, exist_ok=True)

for file in OAK_FILES:
    dest_path = os.path.join(DEST_DIR, f"phuthu_{file}")
    if os.path.exists(dest_path):
        print(f"Skip {file} (already exists)")
        continue

    url = SRC_URL + file
    print(f"Downloading: {file}")
    r = requests.get(url)
    if r.status_code != 200:
        print(f"Failed to download {file}: {r.status_code}")
        continue

    with open(file, "wb") as f:
        f.write(r.content)

    # 変換処理
    img = Image.open(file).convert("RGBA")
    tint = Image.new("RGBA", img.size, (117, 61, 207, 128))  # #753dcf, alpha 128
    img = Image.alpha_composite(img, tint)
    img.save(dest_path)
    print(f"Converted {file} -> {dest_path}")

    os.remove(file)
