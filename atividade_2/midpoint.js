// https://github.com/d3/d3-interpolate

let color_buffer = new Canvas("canvas");
color_buffer.clear();

function reflect_to_first(x1, y1, x2, y2) {

  let dx = Math.abs(x2 - x1); // delta_x
  let dy = Math.abs(y2 - y1); // delta_y


  if(dx > dy) { // 1, 4, 5, 8
    if ( x1 < x2  && y1 <= y2) { // 1
      return {
        a: { x: x1, y: y1 },
        b: { x: x2, y: y2 },
        octant: 1
      };
    }
    if ( x2 < x1  && y1 <= y2) { // 4
      return {
        a: { x: -x1, y: y1 },
        b: { x: -x2, y: y2 },
        octant: 4
      };
    }
    if ( x2 < x1  && y2 <= y1) { // 5
      return {
        a: { x: -x1, y: -y1 },
        b: { x: -x2, y: -y2 },
        octant: 5
      };
    }
    if ( x1 < x2  && y2 <= y1) { // 8
      return {
        a: { x: x1, y: -y1 },
        b: { x: x2, y: -y2 },
        octant: 8
      };
    }
  } else if (dy > dx) { // 2, 3, 6 e 7
    if ( y1 < y2  && x1 <= x2) { // 2
      return {
        a: { x: y1, y: x1 },
        b: { x: y2, y: x2 },
        octant: 2
      };
    }
    if ( y1 < y2  && x2 <= x1) { // 3
      return {
        a: { x: y1, y: -x1 },
        b: { x: y2, y: -x2 },
        octant: 3
      };
    }
    if ( y2 < y1  && x2 <= x1) { // 6
      return {
        a: { x: -y1, y: x1 },
        b: { x: -y2, y: x2 },
        octant: 6
      };
    }
    if ( y2 < y1  && x1 <= x2) { // 7
      return {
        a: { x: -y1, y: -x1 },
        b: { x: -y2, y: -x2 },
        octant: 7
      };
    }
  }
}

function reflect_out_first(x, y, octant = 1) {

  switch (octant) {
    case 2:
      return { x: y, y: x };
    case 3:
      return { x: -y, y: x };
    case 4:
      return { x: -x, y: y };
    case 5:
      return { x: -x, y: -y };
    case 6:
      return { x: y, y: -x };
    case 7:
      return { x: -y, y: -x };
    case 8:
      return { x: x, y: -y };
    default:
      return { x, y };    
  }
}

function MidPointLineAlgorithm(x0, y0, x1, y1, color_0, color_1) {
	let dx = x1 - x0; // delta_x
  let dy = y1 - y0; // delta_y
  
  const range = dx > dy ? dx : dy; // maximum number of points, range to interpolate colors
  var step = 0; // initial color offset
  
  let d = 2*dy-dx; // decision var for first pixel
  let incE = 2*dy;
  let incNE = 2*(dy-dx); 

  let projection = reflect_to_first(x0, y0, x1, y1);
  console.log(JSON.stringify(projection, null, 4));
  let x = projection.a.x;
  let y = projection.a.y;

  color_buffer.putPixel(x0, y0, InterpolateColor(range, step, color_0, color_1)); // first point, no projection needed
  step++; // increment step to change next color;

  let projection_undone = {};
  while (x < projection.b.x) {
    if (d <= 0) {
      d += incE;
      x++;
    } else {
      d += incNE;
      x++;
      y++;
    }

    projection_undone = reflect_out_first(x, y, projection.octant);
    // console.log(JSON.stringify(projection_undone, null, 4));
    color_buffer.putPixel(projection_undone.x, projection_undone.y, InterpolateColor(range, step, color_0, color_1));
    step++; // increment step to change next color;
  }
}

function DrawTriangle(x0, y0, x1, y1, x2, y2, color_0, color_1, color_2) {
  // first/left edge
	MidPointLineAlgorithm(x0, y0, x1,y1, color_1, color_2);
  // second/right edge
  MidPointLineAlgorithm(y1, x1, y2,x2, color_1, color_2);
  // third/bottom edge
  MidPointLineAlgorithm(x0, y0, x2,y2, color_1, color_2); 
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
