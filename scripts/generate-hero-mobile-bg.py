#!/usr/bin/env python3
"""
Generate hero background PNGs tuned for specific mobile logical sizes (from public/assets/bg.png).

Default mode is **contain** (like CSS background-size: contain): the whole source image is scaled
down (or up) to fit inside WxH with aspect ratio preserved; any empty area is filled with
parchment so nothing is cropped off the left/right/top/bottom.

Optional **cover** mode fills the frame then center-crops (can clip edges). **fit-width** scales
to target width then crops or pads height.

  pip install Pillow
  python3 scripts/generate-hero-mobile-bg.py --presets
  python3 scripts/generate-hero-mobile-bg.py 390 844
  python3 scripts/generate-hero-mobile-bg.py 393 852 --mode cover

Outputs default to: public/assets/bg_mobile_{width}x{height}.png
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError as exc:  # pragma: no cover
    print("Missing Pillow. Install with:  pip install Pillow", file=sys.stderr)
    raise SystemExit(1) from exc

try:
    lanczos = Image.Resampling.LANCZOS
except AttributeError:  # Pillow < 9.1
    lanczos = Image.LANCZOS

# Built-in presets (logical px). Edit this list or pass WIDTH HEIGHT on the CLI.
DEFAULT_PRESETS: list[tuple[int, int]] = [
    (390, 844),
    (430, 932),
]

# Matches app theme --color-parchment
PARCHMENT_RGB = (253, 248, 240)


def contain_letterbox(im: Image.Image, target_w: int, target_h: int) -> Image.Image:
    """Scale image to fit entirely inside target WxH; center on parchment canvas (no clipping)."""
    src_w, src_h = im.size
    if src_w <= 0 or src_h <= 0:
        raise ValueError("Invalid source image size")
    scale = min(target_w / src_w, target_h / src_h)
    new_w = max(1, int(round(src_w * scale)))
    new_h = max(1, int(round(src_h * scale)))
    resized = im.resize((new_w, new_h), lanczos)
    out = Image.new("RGB", (target_w, target_h), PARCHMENT_RGB)
    x0 = (target_w - new_w) // 2
    y0 = (target_h - new_h) // 2
    out.paste(resized, (x0, y0))
    return out


def cover_crop(im: Image.Image, target_w: int, target_h: int) -> Image.Image:
    """Scale image to cover target box, then center-crop to exact WxH."""
    src_w, src_h = im.size
    if src_w <= 0 or src_h <= 0:
        raise ValueError("Invalid source image size")
    scale = max(target_w / src_w, target_h / src_h)
    new_w = max(1, int(round(src_w * scale)))
    new_h = max(1, int(round(src_h * scale)))
    resized = im.resize((new_w, new_h), lanczos)
    left = (new_w - target_w) // 2
    top = (new_h - target_h) // 2
    return resized.crop((left, top, left + target_w, top + target_h))


def fit_width_then_crop(
    im: Image.Image, target_w: int, target_h: int, *, valign: str = "center"
) -> Image.Image:
    """Scale so width matches target_w (like CSS width:100%; height:auto), then crop height to target_h."""
    src_w, src_h = im.size
    scale = target_w / src_w
    new_w = target_w
    new_h = max(1, int(round(src_h * scale)))
    resized = im.resize((new_w, new_h), lanczos)
    if new_h <= target_h:
        # Pad vertically with edge color (simple: top-aligned crop area = full image)
        out = Image.new("RGB", (target_w, target_h), (253, 248, 240))
        y0 = 0 if valign == "top" else (target_h - new_h) // 2 if valign == "center" else target_h - new_h
        out.paste(resized, (0, max(0, y0)))
        return out
    top = (new_h - target_h) // 2 if valign == "center" else 0 if valign == "top" else new_h - target_h
    return resized.crop((0, top, target_w, top + target_h))


def main() -> None:
    root = Path(__file__).resolve().parent.parent
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--input",
        type=Path,
        default=root / "public" / "assets" / "bg.png",
        help="Source hero image (default: public/assets/bg.png)",
    )
    parser.add_argument(
        "--output-dir",
        type=Path,
        default=root / "public" / "assets",
        help="Directory for output PNGs (default: public/assets)",
    )
    parser.add_argument(
        "--mode",
        choices=("contain", "cover", "fit-width"),
        default="contain",
        help="contain = full image visible, letterbox on parchment (default). cover = fill then crop. fit-width = scale to width then crop/pad height.",
    )
    parser.add_argument(
        "--presets",
        action="store_true",
        help=f"Generate all built-in sizes: {', '.join(f'{w}x{h}' for w, h in DEFAULT_PRESETS)}",
    )
    parser.add_argument("width", nargs="?", type=int, help="Target logical width (px)")
    parser.add_argument("height", nargs="?", type=int, help="Target logical height (px)")

    args = parser.parse_args()

    src_path = args.input.resolve()
    if not src_path.is_file():
        print(f"Input not found: {src_path}", file=sys.stderr)
        raise SystemExit(2)

    out_dir = args.output_dir.resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    jobs: list[tuple[int, int]] = []
    if args.presets:
        jobs = list(DEFAULT_PRESETS)
    else:
        if args.width is None or args.height is None:
            parser.print_help()
            print("\nProvide WIDTH HEIGHT, or use --presets.", file=sys.stderr)
            raise SystemExit(2)
        if args.width < 1 or args.height < 1:
            print("width and height must be positive integers", file=sys.stderr)
            raise SystemExit(2)
        jobs = [(args.width, args.height)]

    with Image.open(src_path) as im:
        im = im.convert("RGB")
        for w, h in jobs:
            if args.mode == "contain":
                out = contain_letterbox(im, w, h)
            elif args.mode == "cover":
                out = cover_crop(im, w, h)
            else:
                out = fit_width_then_crop(im, w, h, valign="center")
            out_path = out_dir / f"bg_mobile_{w}x{h}.png"
            out.save(out_path, format="PNG", optimize=True)
            print(f"Wrote {out_path}  ({src_path.name} -> {w}x{h}, mode={args.mode})")


if __name__ == "__main__":
    main()
