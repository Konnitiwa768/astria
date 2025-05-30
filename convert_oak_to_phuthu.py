from PIL import Image
import sys
import os

input_file = sys.argv[1]
output_file = sys.argv[2]

img = Image.open(input_file).convert("RGBA")
tint = Image.new("RGBA", img.size, (117, 61, 207, 128))  # #753dcf, alpha 128
img = Image.alpha_composite(img, tint)
os.makedirs(os.path.dirname(output_file), exist_ok=True)
img.save(output_file)
print(f"Converted {input_file} -> {output_file}")
