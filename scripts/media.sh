#!/usr/bin/env bash
# Rebuilds every web-optimised video + poster in public/media from Rohit's original footage.
# Usage: bash scripts/media.sh        (needs ffmpeg with libx264 + libvpx-vp9 + libwebp)
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=public/media
PROMO="$HOME/Documents/PromoVideos"
ANCHOR="$HOME/Documents/Web/rohitsainier.github.io/assets/videos/anchor.mp4"

# clip <src> <start> <end> <out-name> <width> [crop-filter]
# Muted, looping preview: H.264 MP4 + WebP poster (first frame). Clips are tiny, so MP4 alone is enough.
clip() {
  local src="$1" ss="$2" to="$3" name="$4" w="$5" crop="${6:-}"
  local vf="${crop:+$crop,}scale=${w}:-2:flags=lanczos,fps=30"
  ffmpeg -v error -y -ss "$ss" -to "$to" -i "$src" -an -vf "$vf" \
    -c:v libx264 -preset slow -crf 27 -pix_fmt yuv420p -profile:v high -movflags +faststart "$OUT/$name.mp4"
  ffmpeg -v error -y -ss "$ss" -i "$src" -frames:v 1 -vf "$vf" -c:v libwebp -quality 78 "$OUT/$name.webp"
  echo "  $name  mp4=$(du -h "$OUT/$name.mp4" | cut -f1)"
}

echo "hero (English source, with audio)"
ffmpeg -v error -y -ss 0 -to 22.96 -i "$ANCHOR" -vf "fps=25" -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p \
  -profile:v high -movflags +faststart -c:a aac -b:a 96k -ac 1 "$OUT/hero/en.mp4"
ffmpeg -v error -y -ss 0 -to 22.96 -i "$ANCHOR" -vf "fps=25" -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -deadline good \
  -cpu-used 2 -c:a libopus -b:a 64k -ac 1 "$OUT/hero/en.webm"
ffmpeg -v error -y -ss 0.4 -i "$ANCHOR" -frames:v 1 -c:v libwebp -quality 80 "$OUT/hero/poster.webp"
echo "  en.mp4=$(du -h $OUT/hero/en.mp4 | cut -f1) en.webm=$(du -h $OUT/hero/en.webm | cut -f1)"

echo "hero (Hindi dub from the dubbing pipeline)"
DUB="${DUB:-}"
if [ -n "$DUB" ] && [ -f "$DUB" ]; then
  ffmpeg -v error -y -i "$DUB" -vf fps=25 -c:v libx264 -preset slow -crf 25 -pix_fmt yuv420p -profile:v high -movflags +faststart -c:a aac -b:a 96k -ac 1 "$OUT/hero/hi.mp4"
  ffmpeg -v error -y -i "$DUB" -vf fps=25 -c:v libvpx-vp9 -crf 34 -b:v 0 -row-mt 1 -deadline good -cpu-used 2 -c:a libopus -b:a 64k -ac 1 "$OUT/hero/hi.webm"
  ffmpeg -v error -y -ss 0.4 -i "$DUB" -frames:v 1 -c:v libwebp -quality 80 "$OUT/hero/hi.webp"
else
  echo "  (set DUB=/path/to/hi_dub.mp4 to re-encode the Hindi clip)"
fi
cp "$OUT/hero/poster.webp" "$OUT/hero/en.webp"

echo "work clips"
clip "$PROMO/CreatorCutAd_branded.mp4"        31.0 37.0 work/creatorcut-dual     1280
clip "$PROMO/creatorcut/CreatorCut_Promo.mp4" 23.0 28.0 work/creatorcut-crop     1280
clip "$PROMO/creatorcut/CreatorCut_Promo.mp4" 31.2 35.6 work/creatorcut-prompter 1280
clip "$PROMO/CreatorCutAd_branded.mp4"        39.6 46.0 work/creatorcut-mac      1280
clip "$PROMO/Cli.mp4"                          22.0 34.0 work/bharatlink-cli      900 "crop=1000:620:460:230"
clip "$PROMO/editra-promo.mp4"                 7.6 10.0 work/editra-transcript   1280
clip "$PROMO/QuickKitPromo.mp4"                6.4 10.2 work/quickkit-menubar    1280
clip "$PROMO/StyleSnapPromo.mp4"               3.2 12.0 work/stylesnap-inspect   1280
clip "$PROMO/LinkedCommentPromo.mp4"          12.2 18.5 work/linkedcomment-flow  1280
clip "$PROMO/inkling-promo.mp4"               14.0 22.0 work/inkling             540
echo done
