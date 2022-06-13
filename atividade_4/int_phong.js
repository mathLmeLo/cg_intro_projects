function intPhong() {
// Criação do objeto Three.js que armazenará os dados da cena.
let scene = new THREE.Scene();

// Definição da câmera do Three.js
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 25;

// A câmera é adicionada a cena.
scene.add(camera);

// Criação do objeto Three.js responsável por realizar o rendering.
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Criação do objeto de controle (interação) da câmera.
let controls = new THREE.OrbitControls(camera, renderer.domElement);

//----------------------------------------------------------------------------
// 'geometry' : Variável que contém a geometria (informação sobre vértices
//     e arestas) do objeto a ser renderizado (um torus, neste caso). É importante 
//     observar que, de acordo com o Three.js, a geometria de um objeto não contém
//     ainda a informação sobre o seu material.
//----------------------------------------------------------------------------
let geometry = new THREE.TorusGeometry(10, 3, 16, 25);

//----------------------------------------------------------------------------
// Variáveis do tipo "uniform", enviadas pela CPU aos shaders :
//
// * 'Ia' : intensidade (i.e cor) da luz ambiente.
// * 'lightPosition' : posição da fonte de luz pontual no Espaço do Universo.
// * 'Ip_diffuse_color' : intensidade (i.e cor) do componente difuso da fonte de luz pontual.
// * 'k_a' : coeficiente de reflectância ambiente do objeto.
// * 'k_d' : coeficiente de reflectância difusa do objeto.
// * 'k_s' : coeficiente de reflectância especular do objeto.
//----------------------------------------------------------------------------
let rendering_uniforms = {
    Ia: {type: 'vec3', value: new THREE.Color(0.3, 0.3, 0.3)},
    lightPosition: {type: 'vec3', value: new THREE.Vector3(-20, 10, 10)},
    Ip_diffuse_color: {type: 'vec3', value: new THREE.Color(0.7, 0.7, 0.7)},
    k_a: {type: 'vec3', value: new THREE.Color(0.25, 0.25, 0.85)},
    k_d: {type: 'vec3', value: new THREE.Color(0.25, 0.25, 0.85)},
    k_s: {type: 'vec3', value: new THREE.Color(1, 1, 1)},
    lightColor: {type: 'vec3', value: new THREE.Color(1, 1, 1)},
    objectColor: {type: 'vec3', value: new THREE.Color(0.25, 0.25, 0.85)},
    viewPosition: {type: 'vec3', value: camera.position},
}

//----------------------------------------------------------------------------
// Criação do material na forma de um Vertex Shader e um Fragment Shader customizados.
// Os shaders receberão valores da CPU (i.e. variáveis do tipo 'uniform') por meio da
// variável 'rendering_uniforms'.
//----------------------------------------------------------------------------
let material = new THREE.ShaderMaterial({
    uniforms: rendering_uniforms,
    vertexShader:'',
    fragmentShader: ''
});

//----------------------------------------------------------------------------
// Vertex Shader
//----------------------------------------------------------------------------
material.vertexShader = `
    // 'uniform' contendo informação sobre a fonte de luz ambiente.

    varying vec3 fragPosition;
    varying vec3 normalVector;

    // Programa principal do Vertex Shader.

    void main() {
    
        fragPosition = vec3(modelMatrix * vec4(position, 1.0));  // vertex in world space
        
        normalVector = normalMatrix * normal; // normal vector in world space

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
    `;

//----------------------------------------------------------------------------
// Fragment Shader
//----------------------------------------------------------------------------
material.fragmentShader = `
    // 'I' : valor de cor originalmente calculada pelo Vertex Shader, e já interpolada para o fragmento corrente.
    
    varying vec4 I;
  
    varying vec3 normalVector;  // Surface normal
    varying vec3 fragPosition;       // Vertex position
    
    uniform float k_a;   // Ambient reflection coefficient
    uniform float k_d;   // Diffuse reflection coefficient
    uniform float k_s;   // Specular reflection coefficient
    // Material color
    
    uniform vec3 Ia;
    uniform vec3 Ip_diffuse_color;
    uniform vec3 lightPosition; // Light position
    uniform vec3 lightColor;
    uniform vec3 objectColor;
    uniform vec3 viewPosition;

    // Programa principal do Fragment Shader.

    void main() {
    
      // ambient
      float ambientStrength = 0.1;
      vec3 ambient = ambientStrength * lightColor;


      // diffuse
      vec3 N = normalize(normalVector);
      vec3 L = normalize(lightPosition - fragPosition);
      // N = Normal at point of surface
      // L = normalized vector from point to light source (light direction)
      vec3 diffuse = max(dot(N, L), 0.0) * lightColor;

      // specular
      // R = normalized vector of light reflected off the Surface
      // C = normalized vector from point to camera
      // k = constant expoent; larger k makes smaller highlight
      // specular component = pow(max(dot(R, C), 0), k) * lightColor;
      float specularStrength = 0.5;
      vec3 R = reflect(-L, normalVector);
      vec3 C = normalize(viewPosition - fragPosition);
      vec3 specular = specularStrength * pow(max(dot(C, R), 0.0), 16.0) * lightColor;


      // combine
      gl_FragColor = vec4((ambient + diffuse + specular) * objectColor, 1.0);
    }
    `;

//----------------------------------------------------------------------------
// 'object_mesh' : De acordo com o Three.js, um 'mesh' é a geometria acrescida do material.
//----------------------------------------------------------------------------
var object_mesh = new THREE.Mesh(geometry, material);
scene.add(object_mesh);

//----------------------------------------------------------------------------
// 'render()' : Função que realiza o rendering da cena a cada frame.
//----------------------------------------------------------------------------
function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}

// Chamada da função de rendering.
render();

}

// exports function globally to browser
window.intPhong = intPhong;