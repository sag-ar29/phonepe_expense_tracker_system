import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

def generate_phonepe_icon():
    assets_dir = Path(__file__).resolve().parent / "backend" / "app" / "assets"
    assets_dir.mkdir(parents=True, exist_ok=True)
    frontend_public = Path(__file__).resolve().parent / "frontend" / "public"
    frontend_public.mkdir(parents=True, exist_ok=True)

    size = 512
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # 1. Outer rounded rectangle (PhonePe Purple Gradient simulation)
    radius = 110
    padding = 24
    
    # Draw gradient or smooth rounded square
    for i in range(size - 2 * padding):
        ratio = i / (size - 2 * padding)
        # Gradient from #5f259f (95, 37, 159) to #8238d9 (130, 56, 217)
        r = int(95 + (130 - 95) * ratio)
        g = int(37 + (56 - 37) * ratio)
        b = int(159 + (217 - 159) * ratio)
        draw.line(
            [(padding, padding + i), (size - padding, padding + i)],
            fill=(r, g, b, 255)
        )

    # Create mask for rounded corners
    mask = Image.new("L", (size, size), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle(
        [(padding, padding), (size - padding, size - padding)],
        radius=radius,
        fill=255
    )

    # Apply rounded corner mask
    rounded_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    rounded_img.paste(img, (0, 0), mask=mask)
    draw_final = ImageDraw.Draw(rounded_img)

    # Add a subtle inner border highlight
    draw_final.rounded_rectangle(
        [(padding + 2, padding + 2), (size - padding - 2, size - padding - 2)],
        radius=radius - 2,
        outline=(255, 255, 255, 50),
        width=4
    )

    # 2. Draw Devanagari "पे" glyph in the center
    font_path = "C:/Windows/Fonts/Nirmala.ttc"
    try:
        font = ImageFont.truetype(font_path, 260)
    except Exception:
        font = ImageFont.load_default()

    text = "पे"
    bbox = draw_final.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    
    # Center text
    x = (size - text_w) / 2 - bbox[0]
    y = (size - text_h) / 2 - bbox[1] - 15

    # Draw text shadow
    draw_final.text((x + 3, y + 5), text, font=font, fill=(35, 10, 65, 160))
    # Draw pure crisp white text
    draw_final.text((x, y), text, font=font, fill=(255, 255, 255, 255))

    # Save as high-res PNG
    png_path = assets_dir / "phonepe_icon.png"
    rounded_img.save(png_path, "PNG")
    rounded_img.save(frontend_public / "phonepe_icon.png", "PNG")
    print(f"Saved PNG to {png_path}")

    # Generate multi-resolution Windows ICO
    ico_path = assets_dir / "phonepe_icon.ico"
    icon_sizes = [(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)]
    rounded_img.save(
        ico_path,
        format="ICO",
        sizes=icon_sizes
    )
    rounded_img.save(frontend_public / "favicon.ico", format="ICO", sizes=icon_sizes)
    print(f"Saved multi-resolution Windows ICO to {ico_path}")
    return ico_path

if __name__ == "__main__":
    generate_phonepe_icon()

