from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import math

OUT = Path('public/images')
OUT.mkdir(parents=True, exist_ok=True)
S = 4
W, H = 1200, 400
bold_path = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'

logos = [
    ('jabiyenlogo.png', 'Jabiyen', '#8D7CFF', 'orbit'),
    ('isyenlogo.png', 'Isyen', '#32C7D2', 'wave'),
    ('hiryenlogo.png', 'Hiryen', '#FF9B6D', 'prism'),
    ('jayenwarelogo.png', 'Jayenware', '#72A8FF', 'grid'),
    ('binzeoorglogo.png', 'Binzeo Org', '#B28CFF', 'ring'),
    ('bcloudlogo.png', 'BCloud', '#69B9FF', 'cloud'),
]

def font(size):
    return ImageFont.truetype(bold_path, size * S)

def rgb(hex_color):
    return tuple(int(hex_color[i:i+2], 16) for i in (1, 3, 5))

def icon(draw, kind, x, y, size, color):
    x *= S; y *= S; size *= S
    c = rgb(color)
    line = (*c, 255)
    soft = (*c, 90)
    width = max(4, int(size * .045))
    if kind == 'orbit':
        draw.ellipse((x+size*.18,y+size*.18,x+size*.82,y+size*.82), outline=line, width=width)
        draw.ellipse((x+size*.02,y+size*.30,x+size*.98,y+size*.70), outline=line, width=max(3,int(size*.035)))
        draw.ellipse((x+size*.34,y+size*.34,x+size*.66,y+size*.66), fill=soft, outline=line, width=max(3,int(size*.03)))
        draw.ellipse((x+size*.77,y+size*.20,x+size*.90,y+size*.33), fill=line)
    elif kind == 'wave':
        points = []
        for i in range(41):
            xx = x + size*.10 + i*size*.80/40
            yy = y + size*.55 + math.sin(i/40*math.pi*2.1)*size*.17
            points.append((xx, yy))
        draw.line(points, fill=line, width=width, joint='curve')
        draw.ellipse((x+size*.40,y+size*.12,x+size*.58,y+size*.30), fill=soft, outline=line, width=max(3,int(size*.03)))
    elif kind == 'prism':
        poly = [(x+size*.50,y+size*.08),(x+size*.84,y+size*.30),(x+size*.70,y+size*.84),(x+size*.30,y+size*.84),(x+size*.16,y+size*.30)]
        draw.polygon(poly, fill=soft, outline=line)
        draw.line([(x+size*.50,y+size*.08),(x+size*.50,y+size*.72)], fill=line, width=width)
        draw.line([(x+size*.16,y+size*.30),(x+size*.50,y+size*.72),(x+size*.84,y+size*.30)], fill=line, width=max(3,int(size*.03)))
    elif kind == 'grid':
        draw.rounded_rectangle((x+size*.18,y+size*.18,x+size*.82,y+size*.82), radius=int(size*.08), outline=line, width=max(3,int(size*.035)))
        draw.rounded_rectangle((x+size*.32,y+size*.32,x+size*.68,y+size*.68), radius=int(size*.06), outline=line, width=max(3,int(size*.035)))
        draw.line([(x+size*.50,y+size*.10),(x+size*.50,y+size*.90)], fill=(*c,150), width=max(2,int(size*.025)))
        draw.line([(x+size*.10,y+size*.50),(x+size*.90,y+size*.50)], fill=(*c,150), width=max(2,int(size*.025)))
    elif kind == 'ring':
        draw.ellipse((x+size*.14,y+size*.14,x+size*.86,y+size*.86), outline=line, width=width)
        draw.ellipse((x+size*.32,y+size*.32,x+size*.68,y+size*.68), fill=soft, outline=line, width=max(3,int(size*.03)))
        draw.arc((x+size*.02,y+size*.34,x+size*.98,y+size*.66), 190, 350, fill=line, width=max(3,int(size*.035)))
    elif kind == 'cloud':
        draw.ellipse((x+size*.18,y+size*.40,x+size*.56,y+size*.78), fill=soft, outline=line, width=max(3,int(size*.03)))
        draw.ellipse((x+size*.40,y+size*.23,x+size*.80,y+size*.78), fill=soft, outline=line, width=max(3,int(size*.03)))
        draw.rounded_rectangle((x+size*.14,y+size*.55,x+size*.84,y+size*.80), radius=int(size*.12), fill=soft, outline=line, width=max(3,int(size*.03)))

for filename, label, color, kind in logos:
    image = Image.new('RGBA', (W*S, H*S), (8, 8, 14, 255))
    draw = ImageDraw.Draw(image, 'RGBA')
    # One clear icon only; no badge, subtitle, or decorative wordmark elements.
    icon(draw, kind, 78, 78, 230, color)
    title = font(75 if len(label) <= 8 else 63)
    bbox = draw.textbbox((0, 0), label, font=title)
    text_x = 420*S
    text_y = (H*S - (bbox[3]-bbox[1]))//2 - 3*S
    draw.text((text_x, text_y), label, font=title, fill=(255, 255, 255, 250))
    image.resize((W, H), Image.Resampling.LANCZOS).save(OUT / filename, 'PNG', optimize=True)
    print(OUT / filename)
