// Crie uma pequena biblioteca JavaScript que defina uma classe Vetor, de 3 elementos, e uma
// classe Matriz, de dimensões 3x3. Após, implemente funções que realizem as seguintes operações
// entre estes vetores e matrizes:
// * Norma do vetor.
// * Produto vetorial (cross product) entre dois vetores.
// * Produto escalar (dot product) entre dois vetores.
// * Produto vetor/matriz.
// * Produto matriz/matriz.
// * Determinante da matriz.
// * Transposta da matriz.

class Vector{
  constructor(array) {
    if(array.length != 3) {
      return error;
    }
    this.i = array[0];
    this.j = array[1];
    this.k = array[2];
  }
}

function norm_of_a_vector(vector){
  let square_sum = 0

  square_sum += vector.i ** 2;
  square_sum += vector.j ** 2;
  square_sum += vector.k ** 2;

  return Math.sqrt(square_sum);
}

function cross_product(vector1, vector2) {
  //  | i  j  k | i  j
  //  | i1 j1 k1| i1 j1
  //  | i2 j2 k2| i2 j2
  // just multiply the diagonals

  cross_product_i = (vector1.j * vector2.k - vector1.k * vector2.j);
  cross_product_j = (vector1.k * vector2.i - vector1.i * vector2.k);
  cross_product_k = (vector1.i * vector2.j - vector1.j * vector2.i);

  return [cross_product_i, cross_product_j, cross_product_k];
}

function dot_product(vector1, vector2){
  return vector1.i * vector2.i + vector1.j * vector2.j + vector1.k * vector2.k;
}

class Matrix{
  constructor(array1, array2, array3){
    this.a = new Vector(array1);
    this.b = new Vector(array2);
    this.c = new Vector(array3);
  }
}

function product_matrix_vector(vector, matrix) {
  
  let product = new Vector([
    matrix.a.i * vector.i + matrix.a.j * vector.j + matrix.a.k * vector.k,
    matrix.b.i * vector.i + matrix.b.j * vector.j + matrix.b.k * vector.k,
    matrix.c.i * vector.i + matrix.c.j * vector.j + matrix.c.k * vector.k,
  ]);

  return product;
}

function product_matrix(matrix1, matrix2) {

  let product = new Matrix([
    matrix1.a.i * matrix2.a.i + matrix1.b.i * matrix2.a.j + matrix1.c.i * matrix2.a.k,
    matrix1.a.i * matrix2.b.i + matrix1.b.i * matrix2.b.j + matrix1.c.i * matrix2.b.k,
    matrix1.a.i * matrix2.c.i + matrix1.b.i * matrix2.c.j + matrix1.c.i * matrix2.c.k,
  ], [
    matrix1.a.j * matrix2.a.i + matrix1.b.j * matrix2.a.j + matrix1.c.j * matrix2.a.k,
    matrix1.a.j * matrix2.b.i + matrix1.b.j * matrix2.b.j + matrix1.c.j * matrix2.b.k,
    matrix1.a.j * matrix2.c.i + matrix1.b.j * matrix2.c.j + matrix1.c.j * matrix2.c.k,
  ], [
    matrix1.a.k * matrix2.a.i + matrix1.b.k * matrix2.a.j + matrix1.c.k * matrix2.a.k,
    matrix1.a.k * matrix2.b.i + matrix1.b.k * matrix2.b.j + matrix1.c.k * matrix2.b.k,
    matrix1.a.k * matrix2.c.i + matrix1.b.k * matrix2.c.j + matrix1.c.k * matrix2.c.k,
  ]);

  return product;
}

function determinant(matrix) {
  //  | ai  bi  ci | ai  bi
  //  | aj  bj  cj | aj  bj
  //  | ak  bk  ck | ak  bk

  let diagonal_prin_1 = matrix.c.i * matrix.a.j * matrix.b.k;
  let diagonal_prin_2 = matrix.b.i * matrix.c.j * matrix.a.k;
  let diagonal_prin_3 = matrix.a.i * matrix.b.j * matrix.c.k;
  let diagonal_sec_1 = matrix.c.i * matrix.b.j * matrix.a.k;
  let diagonal_sec_2 = matrix.a.i * matrix.c.j * matrix.b.k;
  let diagonal_sec_3 = matrix.b.i * matrix.a.j * matrix.c.k;

  let d = (diagonal_prin_1 + diagonal_prin_2 + diagonal_prin_3) - (diagonal_sec_1 + diagonal_sec_2 + diagonal_sec_3)

  return d;
}

function transposed(matrix){
  const trans = new Matrix(
    [matrix.a.i, matrix.a.j, matrix.a.k],
    [matrix.b.i, matrix.b.j, matrix.b.k],
    [matrix.c.i, matrix.c.j, matrix.c.k]
  )

  return trans;
}

let vector1;
let vector2;
let matrix1;
let matrix2;

// Norm of a vector
vector1 = new Vector([1,2,2])
console.log('norm_of_a_vector');
console.log(norm_of_a_vector(vector1))

// Cross product of two vectors
vector1 = new Vector([3,-5,4])
vector2 = new Vector([2,6,5])
console.log('cross_product');
console.log(cross_product(vector1, vector2))

// Dot product of two vectors
vector1 = new Vector([3,-5,4])
vector2 = new Vector([2,6,5])
console.log('dot_product');
console.log(dot_product(vector1, vector2))

// Product VectorMatrix
vector1 = new Vector([1,2,2]);
matrix1 = new Matrix([1,2,2], [1,2,2], [1,2,2]);
console.log('product_matrix_vector');
console.log(product_matrix_vector(vector1, matrix1));

// Product MatrixMatrix
matrix1 = new Matrix([1,2,2], [1,2,2], [1,2,2]);
matrix2 = new Matrix([1,2,2], [1,2,2], [1,2,2]);
console.log('product_matrix');
console.log(product_matrix(matrix1, matrix2));

// Determinant
matrix1 = new Matrix([9,2,9], [0,12,0], [1,2,0]);
console.log('determinant');
console.log(determinant(matrix1));

// Transposed Matrix
matrix1 = new Matrix([1,2,2], [1,2,2], [1,2,2]);
console.log('transposed');
console.log(transposed(matrix1));