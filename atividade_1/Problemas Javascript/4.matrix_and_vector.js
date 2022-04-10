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
    this.content = array;
  }
}

function norm_of_a_vector(vector){
  let square_sum = 0
  for(var i = 0; i < vector.content.length; i++){
    square_sum += vector.content[i] ** 2;
  }
  return Math.sqrt(square_sum);
}

function cross_product(vector1, vector2){

}

function dot_product(vector1, vector2){

}

class Matrix{
  constructor(array){

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