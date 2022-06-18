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
let vertices_cube = [new THREE.Vector4(-1.0, -1.0, -1.0, 1.0),
                new THREE.Vector4( 1.0, -1.0, -1.0, 1.0),
                new THREE.Vector4( 1.0, -1.0,  1.0, 1.0),
                new THREE.Vector4(-1.0, -1.0,  1.0, 1.0),
                new THREE.Vector4(-1.0,  1.0, -1.0, 1.0),
                new THREE.Vector4( 1.0,  1.0, -1.0, 1.0),
                new THREE.Vector4( 1.0,  1.0,  1.0, 1.0),
                new THREE.Vector4(-1.0,  1.0,  1.0, 1.0)
              ];

let vertices_rectangle = [new THREE.Vector4(-0.5, -0.5, -1.0, 1.0),
                new THREE.Vector4( 0.5, -0.5, -1.0, 1.0),
                new THREE.Vector4( 0.5, -0.5,  1.0, 1.0),
                new THREE.Vector4(-0.5, -0.5,  1.0, 1.0),
                new THREE.Vector4(-0.5,  0.5, -1.0, 1.0),
                new THREE.Vector4( 0.5,  0.5, -1.0, 1.0),
                new THREE.Vector4( 0.5,  0.5,  1.0, 1.0),
                new THREE.Vector4(-0.5,  0.5,  1.0, 1.0)
              ];

let vertices_triangle = [new THREE.Vector4(-1.0, -1.0, -1.0, 1.0),
                new THREE.Vector4( 1.0, -1.0, -1.0, 1.0),
                new THREE.Vector4( 1.0,  1.0, -1.0, 1.0),
                new THREE.Vector4(-1.0,  1.0, -1.0, 1.0),
                new THREE.Vector4( 0.0,  0.0, 1.0, 1.0),
              ];

/******************************************************************************
 * As 12 arestas do cubo, indicadas através dos índices dos seus vértices.
 *****************************************************************************/
let edges_cube = [[0,1],
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

let edges_rectangle = [[0,1],
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


let edges_triangle = [[0,1],
            [1,2],
            [2,3],
            [3,0],
            [0,4],
            [1,4],
            [2,4],
            [3,4],
           ];

// Para alterar a figura é só mudar as variáveis aqui
let edges = edges_triangle;
let vertices = vertices_triangle;
let len_vertices = vertices.length;

/******************************************************************************
 * Matriz Model (modelagem): Esp. Objeto --> Esp. Universo. 
 * OBS: A matriz está carregada inicialmente com a identidade.
 *****************************************************************************/
let m_model = new THREE.Matrix4();

m_model.set(1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0);

console.log("\n\nMatriz Model (modelagem): Esp. Objeto --> Esp. Universo. ");
for (let i = 0; i < len_vertices; ++i) {
    console.log(vertices[i]);
    vertices[i].applyMatrix4(m_model);
    console.log(vertices[i]);
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
// Duvida: só subtrair nessa parte né?
let direction = (cam_look_at.clone().sub(cam_pos));
console.log(direction);

let z_cam = (direction.clone().divideScalar(direction.length())).negate(); // checar depois 

console.log("z_cam = ", z_cam);
let cross_up_z = cam_up.clone().cross(z_cam);
console.log("cam_up = ", cam_up);
let x_cam = cross_up_z.divideScalar(cross_up_z.length());
console.log("x_cam = ", x_cam, " cross_up_z = ", cross_up_z);

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
console.log("m_bt = ", m_bt);
console.log("m_t = ", m_t);
let m_view = m_bt.clone().multiply(m_t);
console.log("\n\nMatriz View (visualização): Esp. Universo --> Esp. Câmera.");
for (let i = 0; i < len_vertices; ++i) {
  console.log(vertices[i]);
  vertices[i].applyMatrix4(m_view);
  console.log(vertices[i]);
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

for (let i = 0; i < len_vertices; ++i) {
  vertices[i].applyMatrix4(m_projection);
}
/******************************************************************************
 * Homogeneizacao (divisao por W): Esp. Recorte --> Esp. Canônico
 *****************************************************************************/

// ---------- implementar aqui ----------------------------------------------
for (let i = 0; i < len_vertices; ++i) {
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

// Dúvida como eu defino o valor do quadro? é sempre /2 ou varia de acordo com o valor máximo
scale.set(128/2, 0.0, 0.0, 0.0,
          0.0, 128/2, 0.0, 0.0,
          0.0, 0.0, 1.0, 0.0,
          0.0, 0.0, 0.0, 1.0);

console.log(scale.clone().multiply(translate));
m_viewport = (scale.clone().multiply(translate));
console.log(m_viewport);
// Dúvida: tem que aplicar o floor?
for (let i = 0; i < len_vertices; ++i) {
  console.log(vertices[i])
  vertices[i].applyMatrix4(m_viewport);
  vertices[i].floor();
}
/******************************************************************************
 * Rasterização
 *****************************************************************************/

// ---------- implementar aqui ----------------------------------------------
// midpoint(25, 30, 100, 80, [255, 0, 0, 255], [255, 255, 0, 255]);
for (let i = 0; i < edges.length; ++i) {
  let edge1 = edges[i][0];
  let edge2 = edges[i][1];

  console.log("edge1 = ", vertices[edge1].x, vertices[edge1].y);
  console.log("edge2 = ", vertices[edge2].x, vertices[edge2].y);
  console.log("\n\n");
  midpoint(vertices[edge1].x, vertices[edge1].y, vertices[edge2].x, vertices[edge2].y, [255, 0, 0, 255], [255, 0, 0, 255]);
  // for (let j = 0; j < 30; j++)
  //   color_buffer.putPixel(vertices[i].x+j, vertices[i].y+j, [255,0,0, 255]); 
}

// os valores tão bem fora de 128x128 e não tamo conseguindo colorir o buffer.