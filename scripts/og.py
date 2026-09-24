"""Renders public/og.jpg (1200×630 social card) from the hero frames. Run: python3 scripts/og.py"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG, FG, DIM, ACC = (10, 10, 11), (236, 232, 225), (127, 124, 118), (255, 91, 34)
NM = 'node_modules/'

def font(paths, size):
    for p in paths:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            pass
    return ImageFont.load_default()

big = font([NM + '@fontsource-variable/geist/files/geist-latin-wght-normal.woff2', '/System/Library/Fonts/HelveticaNeue.ttc'], 84)
try:
    big.set_variation_by_axes([520])
except Exception:
    pass
serif = font([NM + '@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff', '/System/Library/Fonts/Supplemental/Georgia Italic.ttf'], 96)
mono = font(['/System/Library/Fonts/Menlo.ttc'], 15)
label = font(['/System/Library/Fonts/Menlo.ttc'], 13)

im = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(im)

def frame(path, box, text, border):
    x, y, w, h = box
    src = Image.open(path).convert('RGB')
    s = max(w / src.width, h / src.height)
    src = src.resize((int(src.width * s), int(src.height * s)), Image.LANCZOS)
    ox, oy = (src.width - w) // 2, int((src.height - h) * 0.35)
    src = src.crop((ox, oy, ox + w, oy + h))
    mask = Image.new('L', (w, h), 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, w, h), 18, fill=255)
    im.paste(src, (x, y), mask)
    d.rounded_rectangle((x, y, x + w, y + h), 18, outline=border, width=2)
    d.text((x, y + h + 14), text, font=label, fill=border if border == ACC else DIM)

frame('public/media/hero/poster.webp', (760, 70, 190, 332), 'SOURCE · EN', (70, 68, 64))
frame('public/media/hero/hi.webp', (975, 70, 190, 332), 'AI · HINDI', ACC)
d.text((962, 236), '→', font=font(['/System/Library/Fonts/Menlo.ttc'], 20), fill=ACC, anchor='mm')

d.text((60, 70), 'ROHIT SAINI — AI ENGINEER / CREATOR / BUILDER', font=mono, fill=FG)
d.ellipse((60, 118, 70, 128), fill=ACC)
d.text((82, 114), 'AI VIDEO EXPERIMENT — 001', font=label, fill=DIM)
d.text((56, 190), 'One video.', font=big, fill=FG)
d.text((56, 282), 'Any language.', font=big, fill=FG)
d.text((58, 370), 'Same face.', font=serif, fill=ACC)
d.line((60, 540, 1140, 540), fill=(40, 39, 37), width=1)
d.text((60, 560), 'Dubbing · lip sync · voice cloning — running on a MacBook', font=label, fill=DIM)
d.text((1140, 560), 'rohitsainier.github.io', font=label, fill=DIM, anchor='ra')
im.save('public/og.jpg', quality=88, optimize=True, progressive=True)
print('wrote public/og.jpg')
