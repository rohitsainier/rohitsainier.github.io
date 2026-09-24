#!/usr/bin/env bash
# Rebuilds every web-optimised video + poster in public/media from the original footage.
# Usage: bash scripts/media.sh        (needs ffmpeg with libx264 + libwebp, and python3 with numpy, scipy + Pillow)
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=public/media
PROMO="$HOME/Documents/PromoVideos"

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

echo "hero (Meera, the virtual anchor — keyed onto the studio set, then encoded)"
# Green-screen takes of the same script in both languages. --face = face centre x, y and width in source pixels,
# so both takes land on the same spot of the 720×1080 frame and can crossfade.
TAKES="${TAKES:-$HOME/Desktop/port}"
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
python3 scripts/composite_anchor.py "$TAKES/anchor1_en.mp4" "$TMP/en.mp4" --face 540.2 576.6 318.2
python3 scripts/composite_anchor.py "$TAKES/anchor1_hi.mp4" "$TMP/hi.mp4" --face 617.4 445.8 364.7
for l in en hi; do
  crf=25; [ "$l" = hi ] && crf=27   # the Hindi take is busier (jewellery, woven silk)
  ffmpeg -v error -y -i "$TMP/$l.mp4" -vf hqdn3d=1.5:1.5:4:4 -c:v libx264 -preset slow -crf $crf -tune film -pix_fmt yuv420p \
    -profile:v high -movflags +faststart -c:a aac -b:a 96k -ac 1 "$OUT/hero/$l.mp4"
  ffmpeg -v error -y -i "$TMP/$l.mp4" -frames:v 1 -c:v libwebp -quality 82 "$OUT/hero/$l.webp"
done
cp "$OUT/hero/en.webp" "$OUT/hero/poster.webp"
echo "  en.mp4=$(du -h $OUT/hero/en.mp4 | cut -f1) hi.mp4=$(du -h $OUT/hero/hi.mp4 | cut -f1)"
echo "  (captions: update src/data/hero-{en,hi}.json, then run node scripts/vtt.mjs)"

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
