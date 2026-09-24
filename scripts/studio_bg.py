"""Procedural virtual-newsroom backdrop in the site's palette (warm charcoal + signal orange). No stock imagery."""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

def studio_bg(w, h, seed=7, subject=(0.5, 0.36)):
    rng = np.random.default_rng(seed)
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    u, v = x / w, y / h
    # base: warm charcoal, slightly lighter toward the top
    base = np.stack([16 + 10 * (1 - v), 14 + 8 * (1 - v), 13 + 6 * (1 - v)], -1)
    img = base.copy()

    def add(layer, amt=1.0):
        nonlocal img
        img = img + layer * amt

    # LED wall: dot matrix across the upper two thirds, fading downward and toward the centre
    wall = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(wall)
    step = max(10, w // 64)
    for yy in range(step // 2, int(h * 0.7), step):
        for xx in range(step // 2, w, step):
            r = step * 0.18
            d.ellipse((xx - r, yy - r, xx + r, yy + r), fill=255)
    wall = np.asarray(wall.filter(ImageFilter.GaussianBlur(step * 0.12)), dtype=np.float32) / 255
    fade = np.clip(1.1 - v / 0.7, 0, 1) * (0.35 + 0.65 * np.clip(np.abs(u - 0.5) * 2.2, 0, 1))
    add((wall * fade)[..., None] * np.array([52, 31, 19], np.float32))

    # practical light bars left + right
    for cx in (0.07, 0.93):
        bar = np.exp(-((u - cx) / 0.012) ** 2) * np.clip(1 - np.abs(v - 0.42) / 0.36, 0, 1) ** 0.6
        add(bar[..., None] * np.array([255, 190, 140], np.float32), 0.55)
        halo = np.exp(-((u - cx) / 0.09) ** 2) * np.clip(1 - np.abs(v - 0.42) / 0.55, 0, 1)
        add(halo[..., None] * np.array([255, 110, 50], np.float32), 0.16)

    # warm glow behind the presenter (rim separation)
    sx, sy = subject
    g = np.exp(-(((u - sx) / 0.34) ** 2 + ((v - sy) / 0.30) ** 2))
    add(g[..., None] * np.array([255, 96, 36], np.float32), 0.22)

    # bokeh: soft out-of-focus lights, mostly high and to the sides
    bok = Image.new('RGB', (w, h), (0, 0, 0))
    bd = ImageDraw.Draw(bok)
    for _ in range(70):
        bx = rng.uniform(0, 1)
        if abs(bx - sx) < 0.18 and rng.uniform() < 0.8:
            bx = sx + np.sign(bx - sx + 1e-3) * rng.uniform(0.18, 0.5)
        by = rng.uniform(0.02, 0.62)
        r = rng.uniform(0.006, 0.03) * w
        col = [(255, 150, 90), (255, 200, 150), (255, 91, 34), (236, 232, 225)][rng.integers(0, 4)]
        a = rng.uniform(0.18, 0.55)
        bd.ellipse((bx * w - r, by * h - r, bx * w + r, by * h + r), fill=tuple(int(c * a) for c in col))
    bok = np.asarray(bok.filter(ImageFilter.GaussianBlur(w * 0.006)), dtype=np.float32)
    add(bok, 0.8)

    # vignette + gentle defocus
    vig = 1 - 0.55 * np.clip(((u - 0.5) ** 2 * 1.6 + (v - 0.45) ** 2 * 1.2) * 2.2, 0, 1)
    img = img * vig[..., None]
    out = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(w * 0.0025))
    return np.asarray(out)

if __name__ == '__main__':
    import sys
    w, h = int(sys.argv[1]), int(sys.argv[2])
    Image.fromarray(studio_bg(w, h)).save(sys.argv[3])
