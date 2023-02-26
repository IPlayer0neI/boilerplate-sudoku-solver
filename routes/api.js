'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let {puzzle, value, coordinate}= req.body;
      coordinate = coordinate.match(/\w/ig);
      coordinate[0] = coordinate[0].toLowerCase().charCodeAt(0) - 97;
      coordinate[1] = coordinate[1] - 1;
      
      let result;
      let conflict = [];
      let rowConflict = solver.checkRowPlacement(puzzle, coordinate[0],  coordinate[1], value);
      let colConflict = solver.checkColPlacement(puzzle,  coordinate[0],  coordinate[1], value);
      let regionConflict = solver.checkRegionPlacement(puzzle,  coordinate[0],  coordinate[1], value);
      let valid = !(rowConflict || colConflict|| regionConflict);
      
      if(rowConflict) conflict.push("row");
      if(colConflict) conflict.push("column");
      if(regionConflict) conflict.push("region")

      result = conflict[0]?{valid, conflict}:{valid};
      
      res.json(result);
    });
    
  app.route('/api/solve')
    .post((req, res, next) => {
      let solution = solver.solve(req.body.puzzle);
     
      res.json({solution})
    });
};
