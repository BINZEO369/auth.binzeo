from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
import math

OUT = Path('public/images')
OUT.mkdir(parents=True, exist_ok=True)
S = 4
W, H = 1200, 400
font_bold = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
font_reg = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'

logos = [
    ('jabiyenlogo.png', 'JABIYEN', '#6E63D8', 'orbit'),
    ('isyenlogo.png', 'ISYEN', '#0C9EAF', 'wave'),
    ('hiryenlogo.png', 'HIRYEN', '#E47B54', 'prism'),
    ('jayenwarelogo.png', 'JAYENWARE', '#4A82D8', 'grid'),
    ('binzeoorglogo.png', 'BINZEO ORG', '#704F9E', 'ring'),
    ('bcloudlogo.png', 'BCLOUD', '#4D91C8', 'cloud'),
]

def font(path, size):
    return ImageFont.truetype(path, size * S)

def draw_icon(d, kind, x, y, size, color):
    x *= S; y *= S; size *= S
    c = tuple(int(color[i:i+2], 16) for i in (1,3,5))
    soft = (*c, 70)
    line = (*c, 235)
    transparent = (255,255,255,0)
    if kind == 'orbit':
        d.ellipse((x+size*.18,y+size*.18,x+size*.82,y+size*.82), outline=line, width=max(3,int(size*.045)))
        d.ellipse((x+size*.02,y+size*.30,x+size*.98,y+size*.70), outline=(*c,180), width=max(2,int(size*.03)))
        d.ellipse((x+size*.34,y+size*.34,x+size*.66,y+size*.66), fill=soft, outline=line, width=max(2,int(size*.03)))
        d.ellipse((x+size*.76,y+size*.23,x+size*.87,y+size*.34), fill=line)
    elif kind == 'wave':
        pts=[]
        for i in range(41):
            xx=x+size*.12+i*size*.76/40
            yy=y+size*.53 + math.sin(i/40*math.pi*2.2)*size*.15
            pts.append((xx,yy))
        d.line(pts, fill=line, width=max(4,int(size*.055)), joint='curve')
        d.line([(x+size*.15,y+size*.66),(x+size*.85,y+size*.66)], fill=(*c,90), width=max(2,int(size*.025)))
        d.ellipse((x+size*.42,y+size*.18,x+size*.58,y+size*.34), fill=soft, outline=line, width=max(2,int(size*.025)))
    elif kind == 'prism':
        poly=[(x+size*.50,y+size*.08),(x+size*.83,y+size*.28),(x+size*.70,y+size*.82),(x+size*.30,y+size*.82),(x+size*.17,y+size*.28)]
        d.polygon(poly, fill=soft, outline=line)
        d.line([(x+size*.50,y+size*.08),(x+size*.50,y+size*.72)], fill=line, width=max(3,int(size*.035)))
        d.line([(x+size*.17,y+size*.28),(x+size*.50,y+size*.72),(x+size*.83,y+size*.28)], fill=(*c,170), width=max(2,int(size*.025)))
    elif kind == 'grid':
        for i in range(4):
            xx=x+size*(.20+i*.20)
            d.line([(xx,y+size*.18),(xx,y+size*.82)], fill=(*c,110), width=max(2,int(size*.025)))
            yy=y+size*(.18+i*.20)
            d.line([(x+size*.20,yy),(x+size*.80,yy)], fill=(*c,110), width=max(2,int(size*.025)))
        d.rounded_rectangle((x+size*.30,y+size*.30,x+size*.70,y+size*.70), radius=int(size*.08), outline=line, width=max(3,int(size*.04)))
    elif kind == 'ring':
        d.ellipse((x+size*.15,y+size*.15,x+size*.85,y+size*.85), outline=line, width=max(4,int(size*.05)))
        d.ellipse((x+size*.30,y+size*.30,x+size*.70,y+size*.70), fill=soft, outline=(*c,150), width=max(2,int(size*.03)))
        d.arc((x+size*.02,y+size*.34,x+size*.98,y+size*.66), 190, 350, fill=line, width=max(3,int(size*.035)))
    elif kind == 'cloud':
        d.ellipse((x+size*.20,y+size*.38,x+size*.55,y+size*.75), fill=soft, outline=line, width=max(2,int(size*.025)))
        d.ellipse((x+size*.40,y+size*.25,x+size*.78,y+size*.75), fill=soft, outline=line, width=max(2,int(size*.025)))
        d.rounded_rectangle((x+size*.16,y+size*.52,x+size*.82,y+size*.78), radius=int(size*.12), fill=soft, outline=line, width=max(2,int(size*.025)))
        d.line([(x+size*.30,y+size*.88),(x+size*.70,y+size*.88)], fill=line, width=max(3,int(size*.04)))

for filename, label, color, kind in logos:
    im = Image.new('RGBA', (W*S,H*S), (255,255,255,0))
    d = ImageDraw.Draw(im, 'RGBA')
    draw_icon(d, kind, 58, 55, 290, color)
    title_font = font(font_bold, 78 if len(label) < 8 else 64)
    small_font = font(font_reg, 22)
    tx = 400*S
    bbox = d.textbbox((tx,0), label, font=title_font)
    ty = (H*S - (bbox[3]-bbox[1]))//2 - 18*S
    d.text((tx,ty), label, font=title_font, fill=(38,36,57,245), spacing=4)
    d.text((tx, ty + (bbox[3]-bbox[1]) + 22*S), 'BINZEO ecosystem', font=small_font, fill=(105,101,126,190))
    # subtle accent rule
    d.rounded_rectangle((tx, H*S-58*S, tx+210*S, H*S-52*S), radius=3*S, fill=(*tuple(int(color[i:i+2],16) for i in (1,3,5)), 180))
    im.resize((W,H), Image.Resampling.LANCZOS).save(OUT / filename, 'PNG', optimize=True)
    print(OUT / filename)
