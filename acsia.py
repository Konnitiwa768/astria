import os
import requests
from PIL import Image

OAK_FILES = [
    "planks_oak.png",
    "stripped_log_oak.png",
    "stripped_wood_oak.png",
    "wood_oak.png",
    "door_oak.png",
    "trapdoor_oak.png",
    "pressure_plate_oak.png",
    "button_oak.png",
    "fence_oak.png",
    "fence_gate_oak.png",
    "stairs_oak.png",
    "slab_oak.png",
    "sign_oak.png",
    "boat_oak.png",
    "hanging_sign_oak.png",
    "sapling_oak.png"
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
