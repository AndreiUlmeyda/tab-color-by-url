/**
 * Composites a 4px colour stripe across the bottom of the given ImageData.
 * Returns a new ImageData — does not mutate the input.
 * Pure pixel manipulation — no canvas or DOM dependency.
 */
export function compositeFavicon(source: ImageData, color: string): ImageData {
  const { width, height, data } = source;
  const output = new Uint8ClampedArray(data);

  const [r, g, b] = hexToRgb(color);
  const stripeHeight = Math.max(1, Math.round(height * 0.125));
  const stripeStartRow = height - stripeHeight;

  for (let row = stripeStartRow; row < height; row++) {
    for (let col = 0; col < width; col++) {
      const idx = (row * width + col) * 4;
      output[idx] = r;
      output[idx + 1] = g;
      output[idx + 2] = b;
      output[idx + 3] = 255;
    }
  }

  return new ImageData(output, width, height);
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}
