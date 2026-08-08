import { describe, it, expect } from "vitest";
import { compositeFavicon } from "../composite";

function makeImageData(width: number, height: number, fill = "#ffffff"): ImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  const r = parseInt(fill.slice(1, 3), 16);
  const g = parseInt(fill.slice(3, 5), 16);
  const b = parseInt(fill.slice(5, 7), 16);
  for (let i = 0; i < data.length; i += 4) {
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = 255;
  }
  return new ImageData(data, width, height);
}

function getPixel(imageData: ImageData, x: number, y: number): [number, number, number, number] {
  const idx = (y * imageData.width + x) * 4;
  return [
    imageData.data[idx],
    imageData.data[idx + 1],
    imageData.data[idx + 2],
    imageData.data[idx + 3],
  ];
}

describe("compositeFavicon", () => {
  it("leaves top rows unchanged", () => {
    const source = makeImageData(32, 32, "#ffffff");
    const result = compositeFavicon(source, "#f28b82");
    const [r, g, b] = getPixel(result, 0, 0);
    expect(r).toBe(255);
    expect(g).toBe(255);
    expect(b).toBe(255);
  });

  it("paints bottom stripe rows with the exact given colour", () => {
    const source = makeImageData(32, 32, "#ffffff");
    const result = compositeFavicon(source, "#f28b82");

    const stripeHeight = Math.max(1, Math.round(32 * 0.125)); // 4
    const stripeStartRow = 32 - stripeHeight;

    for (let row = stripeStartRow; row < 32; row++) {
      const [r, g, b, a] = getPixel(result, 0, row);
      expect(r).toBe(0xf2);
      expect(g).toBe(0x8b);
      expect(b).toBe(0x82);
      expect(a).toBe(255);
    }
  });

  it("does not mutate the source ImageData", () => {
    const source = makeImageData(32, 32, "#ffffff");
    const before = getPixel(source, 0, 31);
    compositeFavicon(source, "#f28b82");
    expect(getPixel(source, 0, 31)).toEqual(before);
  });

  it("works with 16x16 favicon", () => {
    const source = makeImageData(16, 16, "#ffffff");
    const result = compositeFavicon(source, "#aecbfa");
    expect(result.width).toBe(16);
    expect(result.height).toBe(16);
    const [r, g, b] = getPixel(result, 0, 15);
    expect(r).toBe(0xae);
    expect(g).toBe(0xcb);
    expect(b).toBe(0xfa);
  });
});
