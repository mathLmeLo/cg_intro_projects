let color_buffer = new Canvas("canvas");
color_buffer.clear();

function MidPointLineAlgorithm(x0, y0, x1, y1, color_0, color_1) {
  let dx = Math.abs(x1 - x0);
  let dy = Math.abs(y1 - y0);

  let xi = x0 < x1 ? 1 : -1;
  let yi = y0 < y1 ? 1 : -1;

  let x = x0;
  let y = y0;

  let d, incX, incY;

  let pixelColor = [...color_0];

  const lerpDelta = Math.max(dx, dy);

  const lerpSteps = {
    r: Math.round((color_1[0] - color_0[0]) / lerpDelta),
    g: Math.round((color_1[1] - color_0[1]) / lerpDelta),
    b: Math.round((color_1[2] - color_0[2]) / lerpDelta),
    a: Math.round((color_1[3] - color_0[3]) / lerpDelta),
  };

  if (dx > dy) {
    d = 2 * dy - dx;
    incX = 2 * dy;
    incY = 2 * (dy - dx);
    color_buffer.putPixel(x, y, pixelColor);
    while (x != x1) {
      if (d > 0) {
        y += yi;
        d += incY;
      } else {
        d += incX;
      }
      x += xi;
      color_buffer.putPixel(x, y, pixelColor);
      pixelColor[0] += lerpSteps.r;
      pixelColor[1] += lerpSteps.g;
      pixelColor[2] += lerpSteps.b;
      pixelColor[3] += lerpSteps.a;
    }
  } else {
    d = 2 * dx - dy;
    incX = 2 * dx;
    incY = 2 * (dx - dy);
    color_buffer.putPixel(x, y, pixelColor);

    while (y != y1) {
      if (d > 0) {
        x += xi;
        d += incY;
      } else {
        d += incX;
      }
      y += yi;
      color_buffer.putPixel(x, y, pixelColor);
      pixelColor[0] += lerpSteps.r;
      pixelColor[1] += lerpSteps.g;
      pixelColor[2] += lerpSteps.b;
      pixelColor[3] += lerpSteps.a;
    }
  }
}

function DrawTriangle(x0, y0, x1, y1, x2, y2, color_0, color_1, color_2) {
  MidPointLineAlgorithm(x0, y0, x1, y1, color_0, color_1);
  MidPointLineAlgorithm(x0, y0, x2, y2, color_0, color_2);
  MidPointLineAlgorithm(x2, y2, x1, y1, color_2, color_1);
}

MidPointLineAlgorithm(25, 30, 100, 80, [255, 0, 0, 255], [255, 255, 0, 255]);
color_buffer = new Canvas("canvas2");
DrawTriangle(
  25,
  30,
  50,
  100,
  100,
  15,
  [255, 0, 0, 255],
  [0, 0, 255, 255],
  [0, 255, 0, 255]
);