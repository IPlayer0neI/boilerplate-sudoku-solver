class SudokuSolver {

  cell(row, column){
    return column + (9 * row);
  }

  coordinateCell(length){
    let row = (length - (length%9))/9 ;
    let column = (length - row*9);

    return [row, column];
  }

  canBeSolved(puzzleString, amount){
    let result = amount?{}:false;
    breakar:{
    for(let j = 0; j < 9; j++){
      for(let value = 1; value < 10; value++){
        let rowConflict = this.checkRowPlacement(puzzleString, j, 0, value, true);
        let colConflict = this.checkColPlacement(puzzleString, 0, j, value, true);
        let regionConflict = this.checkRegionPlacement(puzzleString, parseInt(j/3)*3, (j*3)%9, value, true);

        if((colConflict > 1 || rowConflict > 1 || regionConflict > 1) && !amount){
          result = true
          break breakar;
        }else if((colConflict > 1 || rowConflict > 1 || regionConflict > 1) && amount){
          if(rowConflict) result.row = true;
          if(colConflict) result.column = true;
          if(regionConflict) result.region = true;
        };
      };
    };
  };
    return result;
  }

  validate(fields){
    let result = {fieldsTest:{}}
    let {puzzle, coordinate, value} = fields;
    let regexPuzzle = /[^\d\.]/ig;
    let regexCoordinate = /^[a-i]{1}(?<!\d)[1-9](?!\d)/i;
    let regexValue = /(?<!\d)[1-9](?!\d)/i;
    
    if(puzzle){
      result.canBeSolved = this.canBeSolved(puzzle)
      result.charactersTest = regexPuzzle.test(puzzle);
      result.lengthTest = !(puzzle.length == 81);
    }else{
      result.fieldsTest.puzzle = true;
    };
    if(coordinate){
      result.coordinateTest = !regexCoordinate.test(coordinate);
    }else{
      result.fieldsTest.coordinate = true;
    };
    if(value){
      result.valueTest = !regexValue.test(value);
    }else{
      result.fieldsTest.value = true;
    };
    result.allFieldsTest = (result.fieldsTest.puzzle || result.fieldsTest.coordinate || result.fieldsTest.value);
   
    return result;
  }

  checkRowPlacement(puzzleString, row, col, value, amount){
    let result = amount?0:false;
    let ignore = 10;
    if(puzzleString[this.cell(row, col)] == value ) ignore = col;  
    
    for(let j = 0; j < 9; j++){ 
      if(puzzleString[this.cell(row, j)] == value && j != ignore && !amount){
        result = true;
        break;
      }else if(puzzleString[this.cell(row, j)] == value && amount){
        result++;
      };
    };

    return result;
  }

  checkColPlacement(puzzleString, row, col, value, amount) {
    let result = amount?0:false;
    let ignore = 10;
    if(puzzleString[this.cell(row, col)] == value) ignore = row;  
    
    for(let j = 0; j < 9; j ++){
      if(puzzleString[this.cell(j, col)] == value && j != ignore && !amount){
        result = true;
        break;
      }else if(puzzleString[this.cell(j, col)] == value  && amount){
        result++;
      };
    };

    return result;
  }

  checkRegionPlacement(puzzleString, row, col, value, amount) {
    let result = amount?0:false;
    let ignore = 10;
    if(puzzleString[this.cell(row, col)] == value) ignore = this.cell(row, col); 
    
    //Look for the beginning of the square
    while(row%3 != 0 || col%3 != 0){
     if(row%3 !=0){
      row -= 1;
     }else{
      col -= 1;
     };
    };
   
    const limitRow = row + 2;
    const limitColumn = col + 2;
   
    //Iterates the square going left to right, top to bottom
   do{
     let cell = this.cell(row, col)
     let square = puzzleString[cell];
    
     if(square == value && cell != ignore && !amount){
       result = true;
     }else if(square == value  && amount){
       result++
     };
     if(row < limitRow && col == limitColumn ){
       row++
       col -= 2;
     }else{
       col += 1;
     };
    }while(row < limitRow || col <= limitColumn);

    return result;
  }

  solve(puzzleString) {
    let puzzleArray = puzzleString.split("")
  
    let puzzle = puzzleArray
    .map((value, index) => ({value: 0, coordinate: this.coordinateCell(index), valid: value == "."?true:false}) , this)
    .filter((element) => element.valid );
    
    for(let index = 0; index < puzzle.length; index++){
      for(let value = puzzle[index].value + 1; value <= 10; value++){
        let coordinate = puzzle[index].coordinate;
        let rowConflict = this.checkRowPlacement(puzzleArray, coordinate[0],  coordinate[1], value);
        let colConflict = this.checkColPlacement(puzzleArray,  coordinate[0],  coordinate[1], value);
        let regionConflict = this.checkRegionPlacement(puzzleArray,  coordinate[0],  coordinate[1], value);
        let valid = !(rowConflict || colConflict || regionConflict);
        
        if(valid && value < 10){
          puzzle[index].value = value;
          puzzleArray[this.cell(coordinate[0], coordinate[1])] = value;

          break;
        }else if(value >= 9){  
          puzzle[index].value = 0;
          puzzleArray[this.cell(coordinate[0], coordinate[1])] = ".";
          index-=2;

          break;
         };
      };
    };
 
    return puzzleArray.join("")
  }
}

module.exports = SudokuSolver;

