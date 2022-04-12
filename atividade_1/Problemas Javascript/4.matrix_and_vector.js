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
  constructor(array){
    if(array.length != 3){
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

function cross_product(vector1, vector2){
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

function product_matrix_vector(vector, matrix){

}

function product_matrix(matrix1, matrix2){

}

function determinant(matrix){

}

function transposed(matrix){

}

// Norm of a vector
vector1 = new Vector([1,2,2])
console.log(norm_of_a_vector(vector1))

// Cross product of two vectors
vector1 = new Vector([3,-5,4])
vector2 = new Vector([2,6,5])
console.log(cross_product(vector1, vector2))

// Dot product of two vectors
vector1 = new Vector([3,-5,4])
vector2 = new Vector([2,6,5])
console.log(dot_product(vector1, vector2))