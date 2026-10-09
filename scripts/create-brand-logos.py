from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

OUT = Path('public/images')
OUT.mkdir(parents=True, exist_ok=True)
S = 4
W, H = 1200, 400
font_path = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'

# One alphabet per logo: no wordmark, subtitle, or extra text.
logos = [
    ('jabiyenlogo.png', 'J', '#9A82FF'),
    ('isyenlogo.png', 'I', '#36CBD4'),
    ('hiryenlogo.png', 'H', '#FF9C70'),
    ('jayenwarelogo.png', 'J', '#70A8FF'),
    ('binzeoorglogo.png', 'B', '#B68BFF'),
    ('bcloudlogo.png', 'B', '#67BBFF'),
]

for filename, letter, color in logos:
    image = Image.new('RGBA', (W*S, H*S), (6, 7, 12, 255))
    draw = ImageDraw.Draw(image, 'RGBA')
    c = tuple(int(color[i:i+2], 16) for i in (1, 3, 5))

    # A restrained circular mark around the single alphabet.
    cx, cy, radius = 245*S, 200*S, 112*S
    draw.ellipse((cx-radius, cy-radius, cx+radius, cy+radius), outline=(*c, 220), width=5*S)
    draw.ellipse((cx-radius+18*S, cy-radius+18*S, cx+radius-18*S, cy+radius-18*S), outline=(*c, 75), width=2*S)

    letter_font = ImageFont.truetype(font_path, 150*S)
    bbox = draw.textbbox((0, 0), letter, font=letter_font)
    tw, th = bbox[2]-bbox[0], bbox[3]-bbox[1]
    draw.text((cx-tw/2-bbox[0], cy-th/2-bbox[1]-8*S), letter, font=letter_font, fill=(255,255,255,255))

    # No additional visible text: the right side intentionally stays empty.
    image.resize((W, H), Image.Resampling.LANCZOS).save(OUT / filename, 'PNG', optimize=True)
    print(OUT / filename)
