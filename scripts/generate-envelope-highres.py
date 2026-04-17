#!/usr/bin/env python3
"""
Upscale the envelope front background for sharp CSS scaling on retina / large displays.

  pip install Pillow
  python3 scripts/generate-envelope-highres.py
  python3 scripts/generate-envelope-highres.py --scale 2 --input public/assets/front-page-bg.png

Output defaults to public/assets/front-page-bg-highres.png (used by EnvelopeEntry).
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


def main() -> None:
    root = Path(__file__).resolve().parent.parent
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--input",
        type=Path,
        default=root / "public" / "assets" / "front-page-bg.png",
        help="Source PNG (default: public/assets/front-page-bg.png)",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=root / "public" / "assets" / "front-page-bg-highres.png",
        help="Output PNG (default: public/assets/front-page-bg-highres.png)",
    )
    parser.add_argument(
        "--scale",
        type=int,
        default=3,
        help="Integer upscale factor (default: 3, e.g. 3x width and height)",
    )
    args = parser.parse_args()

    if args.scale < 1:
        print("--scale must be >= 1", file=sys.stderr)
        raise SystemExit(2)

    src = args.input.resolve()
    if not src.is_file():
        print(f"Input not found: {src}", file=sys.stderr)
        raise SystemExit(2)

    out = args.output.resolve()
    out.parent.mkdir(parents=True, exist_ok=True)

    try:
        lanczos = Image.Resampling.LANCZOS
    except AttributeError:  # Pillow < 9.1
        lanczos = Image.LANCZOS

    with Image.open(src) as img:
        w, h = img.size
        new_size = (w * args.scale, h * args.scale)
        resized = img.resize(new_size, lanczos)

    # Preserve format; PNG is lossless for this pipeline
    resized.save(out, format="PNG", optimize=True)
    print(f"Wrote {out}  ({w}x{h} -> {new_size[0]}x{new_size[1]}, scale={args.scale})")


if __name__ == "__main__":
    main()
