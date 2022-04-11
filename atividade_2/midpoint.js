// https://github.com/d3/d3-interpolate

let color_buffer = new Canvas("canvas");
color_buffer.clear();

function MidPointLineAlgorithm(x0, y0, x1, y1, color_0, color_1) {
	let dx = x1 - x0; // delta_x
  let dy = y1 - y0; // delta_y
  
  const range = dx > dy ? dx : dy; // maximum number of points, range to interpolate colors
  var step = 0; // initial color offset
  
  let d = 2*dy-dx; // decision var for first pixel
  let incE = 2*dy;
  let incNE = 2*(dy-dx); 
  let x = x0;
  let y = y1;

  color_buffer.putPixel(x, y, InterpolateColor(range, step, color_0, color_1));
  step++; // increment step to change next color;

  while (x < x1) {
    if (d <= 0) {
      d += incE;
      x++;
    } else {
      d += incNE;
      x++;
      y++;
    }

  color_buffer.putPixel(x, y, InterpolateColor(range, step, color_0, color_1));
  step++; // increment step to change next color;
  }
}

function DrawTriangle(x0, y0, x1, y1, x2, y2, color_0, color_1, color_2) {
  // first/left edge
	MidPointLineAlgorithm(x0, y0, x1,y1, color_1, color_2);
  // second/right edge
  MidPointLineAlgorithm(y1, x1, y2,x2, color_1, color_2);
  // third/bottom edge
  MidPointLineAlgorithm(x2, y2, x0,y0, color_1, color_2); 
}

function InterpolateColor(range, step, first_color, second_color) {
  let color_1 = d3.color('rgb(' + first_color[0] + ',' + first_color[1] + ',' + first_color[2] + ')');
  let color_2 = d3.color('rgb(' + second_color[0] + ',' + second_color[1] + ',' + second_color[2] + ')');
  let interpolator = d3.interpolate(color_1, color_2)
  
  // console.log(color_1.formatRgb())
  // console.log(color_2.formatRgb())
  
  let current = (1/range) * step;
  let new_color;

  if(current > 1) {
    new_color = d3.color(interpolator(1))
    return [new_color.r, new_color.g, new_color.b, new_color.opacity];
  } else {
    new_color = d3.color(interpolator(current))
    return [new_color.r, new_color.g, new_color.b, new_color.opacity];
  }
}

 MidPointLineAlgorithm(25, 10, 100,50, [255,0,0,255], [255,255,0,255]);
//  DrawTriangle(25, 30, 50, 100, 100, 15, [255,0,0,255], [0,0,255,255], [0,255,0,255]);
