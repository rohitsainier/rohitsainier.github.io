"""Key a green-screen anchor clip, place it on the procedural studio, and write a master MP4.

usage: python3 scripts/composite_anchor.py SRC.mp4 OUT.mp4 --face CX CY FW   (source px: face centre + width)
Every clip is placed so the face lands at the same spot and size on a 720×1080 canvas.
"""
import argparse, subprocess, sys
import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import gaussian_filter
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from studio_bg import studio_bg

W, H = 720, 1080
TARGET = (357.5, 381.6, 210.6)   # face centre x, y and face width on the canvas

def probe(src):
    out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
                          '-of', 'csv=p=0', src], capture_output=True, text=True).stdout.strip().split(',')
    return int(out[0]), int(out[1])

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('src'); ap.add_argument('out')
    ap.add_argument('--face', nargs=3, type=float, required=True)
    a = ap.parse_args()
    sw0, sh0 = probe(a.src)
    cx, cy, fw = a.face
    s = TARGET[2] / fw
    sw, sh = round(sw0 * s / 2) * 2, round(sh0 * s / 2) * 2
    dx, dy = round(TARGET[0] - cx * s), round(TARGET[1] - cy * s)
    print(f'scale {s:.4f} → {sw}x{sh}, offset ({dx},{dy})', flush=True)

    bg = studio_bg(W, H).astype(np.float32)
    bgb = gaussian_filter(bg, sigma=(10, 10, 0))
    dec = subprocess.Popen(['ffmpeg', '-v', 'error', '-i', a.src, '-vf', f'scale={sw}:{sh}:flags=lanczos,fps=25',
                            '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], stdout=subprocess.PIPE)
    enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', '25',
                            '-i', '-', '-i', a.src, '-map', '0:v', '-map', '1:a',
                            '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11', '-ar', '48000',
                            '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p',
                            '-c:a', 'aac', '-b:a', '160k', '-shortest', a.out], stdin=subprocess.PIPE)
    # canvas window of the scaled source
    x0, y0 = max(0, dx), max(0, dy)
    x1, y1 = min(W, dx + sw), min(H, dy + sh)
    sx0, sy0 = x0 - dx, y0 - dy
    sx1, sy1 = sx0 + (x1 - x0), sy0 + (y1 - y0)
    plate, lo, hi = None, None, None
    n = 0
    while True:
        buf = dec.stdout.read(sw * sh * 3)
        if len(buf) < sw * sh * 3:
            break
        c = np.frombuffer(buf, np.uint8).reshape(sh, sw, 3).astype(np.float32)
        dom = c[..., 1] - np.maximum(c[..., 0], c[..., 2])
        if plate is None:
            bgdom = dom[dom > 30]
            kd = float(np.median(bgdom)) if bgdom.size else 70.0
            kd_low = float(np.percentile(bgdom, 3)) if bgdom.size else 60.0   # darkest (vignetted) green
            lo, hi = 0.10 * kd, min(0.75 * kd, 0.85 * kd_low)
            m = (dom > 0.9 * hi).astype(np.float32)
            num = gaussian_filter(c * m[..., None], sigma=(40, 40, 0))
            den = gaussian_filter(m, sigma=40)[..., None] + 1e-4
            plate = num / den                                   # smooth green-screen colour under the subject
            print(f'key dominance {kd:.1f} → matte {lo:.1f}..{hi:.1f}', flush=True)
        al = np.clip((hi - dom) / (hi - lo), 0, 1)
        al = np.asarray(Image.fromarray((al * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.0)), np.float32) / 255
        al = np.where(al < 0.08, 0.0, al)                          # garbage matte: no faint haze from the screen
        # un-mix the green only where the pixel is mostly foreground (avoids amplifying noise), then despill
        aa = np.clip(al, 0.35, 1)[..., None]
        un = np.clip((c - (1 - aa) * plate) / aa, 0, 255)
        edge = ((al >= 0.25) & (al < 0.98))[..., None]
        fg = np.where(edge, 0.5 * un + 0.5 * c, c)
        fg[..., 1] = np.minimum(fg[..., 1], np.maximum(fg[..., 0], fg[..., 2]))   # despill
        fg[..., 1] = np.maximum(fg[..., 1], np.minimum(fg[..., 0], fg[..., 2]))   # anti-magenta
        fg *= np.array([1.02, 1.0, 0.97], np.float32)          # warm the grade toward the studio light
        # place on the canvas
        A = np.zeros((H, W), np.float32); F = np.zeros((H, W, 3), np.float32)
        A[y0:y1, x0:x1] = al[sy0:sy1, sx0:sx1]
        F[y0:y1, x0:x1] = fg[sy0:sy1, sx0:sx1]
        wrap = np.clip(gaussian_filter(A, 6) - A, 0, 1)[..., None] * A[..., None]
        out = F * A[..., None] + bg * (1 - A[..., None]) + bgb * wrap * 0.35
        enc.stdin.write(np.clip(out, 0, 255).astype(np.uint8).tobytes())
        n += 1
        if n % 100 == 0:
            print(f'  {n} frames', flush=True)
    enc.stdin.close(); enc.wait(); dec.wait()
    print(f'done: {n} frames → {a.out}')

if __name__ == '__main__':
    main()
