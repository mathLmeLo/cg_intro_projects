// Cria um color buffer para armazenar a imagem final.
// const THREE = require('three');

let color_buffer = new Canvas("canvas");
color_buffer.clear();


function midpoint(x0, y0, x1, y1, color_0, color_1) {
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

/******************************************************************************
 * Vértices do modelo (cubo) centralizado no seu espaco do objeto. Os dois
 * vértices extremos do cubo são (-1,-1,-1) e (1,1,1), logo, cada aresta do cubo
 * tem comprimento igual a 2.
 *****************************************************************************/
//                                   X     Y     Z    W (coord. homogênea)
let vertices = [new THREE.Vector4(-1.0, -1.0, -1.0, 1.0),
                new THREE.Vector4( 1.0, -1.0, -1.0, 1.0),
                new THREE.Vector4( 1.0, -1.0,  1.0, 1.0),
                new THREE.Vector4(-1.0, -1.0,  1.0, 1.0),
                new THREE.Vector4(-1.0,  1.0, -1.0, 1.0),
                new THREE.Vector4( 1.0,  1.0, -1.0, 1.0),
                new THREE.Vector4( 1.0,  1.0,  1.0, 1.0),
                new THREE.Vector4(-1.0,  1.0,  1.0, 1.0)];

/******************************************************************************
 * As 12 arestas do cubo, indicadas através dos índices dos seus vértices.
 *****************************************************************************/
let edges = [[0,1],
             [1,2],
             [2,3],
             [3,0],
             [4,5],
             [5,6],
             [6,7],
             [7,4],
             [0,4],
             [1,5],
             [2,6],
             [3,7]];

/******************************************************************************
 * Matriz Model (modelagem): Esp. Objeto --> Esp. Universo. 
 * OBS: A matriz está carregada inicialmente com a identidade.
 *****************************************************************************/
let m_model = new THREE.Matrix4();

m_model.set(1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0);

for (let i = 0; i < 8; ++i) {
    vertices[i].applyMatrix4(m_model);
}
/******************************************************************************
 * Parâmetros da camera sintética.
 *****************************************************************************/
let cam_pos = new THREE.Vector3(1.3,1.7,2.0);     // posição da câmera no esp. do Universo.
let cam_look_at = new THREE.Vector3(0.0,0.0,0.0); // ponto para o qual a câmera aponta.
let cam_up = new THREE.Vector3(0.0,1.0,0.0);      // vetor Up da câmera.

/******************************************************************************
 * Matriz View (visualização): Esp. Universo --> Esp. Câmera
 * OBS: A matriz está carregada inicialmente com a identidade. 
 *****************************************************************************/

// Derivar os vetores da base da câmera a partir dos parâmetros informados acima.

// ---------- implementar aqui ----------------------------------------------

let direction = (cam_look_at.clone().sub(cam_pos));

let z_cam = (direction.clone().divideScalar(direction.length())).negate(); // checar depois 

let cross_up_z = cam_up.clone().cross(z_cam);
let x_cam = cross_up_z.divideScalar(cross_up_z.length());

let cross_z_x = z_cam.clone().cross(x_cam);
let y_cam = cross_z_x.divideScalar(cross_z_x.length());

// Construir 'm_bt', a inversa da matriz de base da câmera.

// ---------- implementar aqui ----------------------------------------------
let m_bt = new THREE.Matrix4();

m_bt.set(x_cam.x, x_cam.y, x_cam.z, 0.0,
        y_cam.x, y_cam.y, y_cam.z, 0.0,
        z_cam.x, z_cam.y, z_cam.z, 0.0,
        0.0, 0.0, 0.0, 1.0);

// Construir a matriz 'm_t' de translação para tratar os casos em que as
// origens do espaço do universo e da câmera não coincidem.

// ---------- implementar aqui ----------------------------------------------
let m_t = new THREE.Matrix4();

m_t.set(1.0, 0.0, 0.0, -cam_pos.x, // considerando a origem como 0,0,0
        0.0, 1.0, 0.0, -cam_pos.y,
        0.0, 0.0, 1.0, -cam_pos.z,
        0.0, 0.0, 0.0, 1.0);

// Constrói a matriz de visualização 'm_view' como o produto
//  de 'm_bt' e 'm_t'.

let m_view = m_bt.clone().multiply(m_t);

for (let i = 0; i < 8; ++i) {
  vertices[i].applyMatrix4(m_view);
}
/******************************************************************************
 * Matriz de Projecao: Esp. Câmera --> Esp. Recorte
 * OBS: A matriz está carregada inicialmente com a identidade. 
 *****************************************************************************/

// ---------- implementar aqui ----------------------------------------------
let m_projection = new THREE.Matrix4();
let d = 1;

m_projection.set(1.0, 0.0, 0.0, 0.0,
                  0.0, 1.0, 0.0, 0.0,
                  0.0, 0.0, 1.0, d,
                  0.0, 0.0, -1/d, 0.0);

for (let i = 0; i < 8; ++i) {
  vertices[i].applyMatrix4(m_projection);
}
/******************************************************************************
 * Homogeneizacao (divisao por W): Esp. Recorte --> Esp. Canônico
 *****************************************************************************/

// ---------- implementar aqui ----------------------------------------------
for (let i = 0; i < 8; ++i) {
  let w = vertices[i].w;
  vertices[i].divideScalar(w);
}

/******************************************************************************
 * Matriz Viewport: Esp. Canônico --> Esp. Tela
 * OBS: A matriz está carregada inicialmente com a identidade. 
 *****************************************************************************/

// ---------- implementar aqui ----------------------------------------------
let m_viewport = new THREE.Matrix4();
let translate = new THREE.Matrix4();
let scale = new THREE.Matrix4();

translate.set(1.0, 0.0, 0.0, 1.0,
              0.0, 1.0, 0.0, 1.0,
              0.0, 0.0, 1.0, 0.0,
              0.0, 0.0, 0.0, 1.0);

scale.set(128/2, 0.0, 0.0, 0.0,
          0.0, 128/2, 0.0, 0.0,
          0.0, 0.0, 1.0, 0.0,
          0.0, 0.0, 0.0, 1.0);

console.log(translate.multiply(scale));
m_viewport = (translate.multiply(scale));
console.log(m_viewport);
for (let i = 0; i < 8; ++i) {
  // console.log(vertices[i])
  vertices[i].applyMatrix4(m_viewport);
}
/******************************************************************************
 * Rasterização
 *****************************************************************************/

// ---------- implementar aqui ----------------------------------------------
// midpoint(25, 30, 100, 80, [255, 0, 0, 255], [255, 255, 0, 255]);
for (let i = 1; i < 8; ++i) {
  console.log(vertices[i].x, vertices[i].y, vertices[i].z);
  // midpoint(vertices[i].x, vertices[i].y, vertices[i-1].x, vertices[i-1].y, [255, 0, 0, 255], [255, 255, 0, 255]);
  color_buffer.putPixel(vertices[i].x, vertices[i].y, [255,0,0]); 
}

// os valores tão bem fora de 128x128 e não tamo conseguindo colorir o buffer.