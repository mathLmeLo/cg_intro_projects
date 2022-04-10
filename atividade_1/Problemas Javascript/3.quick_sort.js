// Implemente o algoritmo QuickSort.

function quick_sort(array){
  console.log(array);
  quick_sort_helper(array, 0, array.length - 1);
  console.log(array);
  return array;
}

function quick_sort_helper(array, pivot_index, right_index){
  if((right_index - pivot_index) <= 0) return;

  let left_index = pivot_index + 1;
  let initial_left_index = left_index;
  let initial_right_index = right_index;

  while (left_index <= right_index){
    if(array[left_index] <= array[pivot_index]){
      left_index += 1;
    }
    else if(array[right_index] > array[pivot_index]){
      right_index -= 1;
    }
    else{
      swap(left_index, right_index, array);
    }
  }
  swap(pivot_index, right_index, array)

  quick_sort_helper(array, initial_left_index - 1, right_index - 1);
  quick_sort_helper(array, right_index + 1, initial_right_index);
}

function swap(i, j, array){
  let temp = array[j];
  array[j] = array[i];
  array[i] = temp;
}

function are_arrays_equal(array1, array2){
  if(array1.length != array2.length) return false;

  for(var i = 0; i < array2.length; i++){
    if(array1[i] != array2[i]){
      return false;
    }
  }
  return true;
}
random_array = Array.from({length: 10}, () => Math.floor(Math.random() * 10));
sorted_array = quick_sort(Array.from(random_array))

console.log(are_arrays_equal(sorted_array, random_array.sort()))
