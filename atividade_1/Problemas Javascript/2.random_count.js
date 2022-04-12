// Escreva um programa que calcule a quantidade de números pares em um array contendo 10
// números inteiros positivos gerados randomicamente.

// A solucão vai gerar 10 números inteiros entre 0 a 9.
random_array = Array.from({length: 10}, () => Math.floor(Math.random() * 10));
var even_elements = 0

for (var i = 0; i < random_array.length; i++){
  if (random_array[i] % 2 == 0){
    even_elements += 1;
  }
}
console.log(random_array)
console.log("Número de inteiros pares é igual a: ", even_elements)
