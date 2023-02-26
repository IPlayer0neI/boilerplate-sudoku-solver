const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
const puzzles = require("../controllers/puzzle-strings.js").puzzlesAndSolutions;
const puzzleTest = puzzles[0][0];
const puzzleTestArray = puzzleTest.split("");
const puzzleTestSolution = puzzles[0][1];
let solver = new Solver();

suite('Unit Tests', () => {
  suite("validate tests", function(){
    test("Valid puzzle characters", function(){
        let puzzleInvalid = Array.from(puzzleTestArray);
        puzzleInvalid[0] = "a";
        let result = solver.validate({puzzle: puzzleInvalid.join("")});
      
        assert.isTrue(result.charactersTest)
    })

    test("Valid puzzle 81 length", function(){
        let result = solver.validate({puzzle: puzzleTest});

        assert.isNotTrue(result.lengthTest);
    });

    test("Invalid puzzle 81 length", function(){
        let puzzleInvalid = Array.from(puzzleTestArray);
        puzzleInvalid.pop();
        let result = solver.validate({puzzle: puzzleInvalid.join("")});
        
        assert.isTrue(result.lengthTest);
    });

    test("Valid puzzle row placement", function(){
        let result = solver.canBeSolved(puzzleTest);

        assert.isNotTrue(result.row);
    });

    test("Invalid puzzle row placement", function(){
        let puzzleInvalid = Array.from(puzzleTestArray);
        puzzleInvalid[1] = "1";
        let result = solver.canBeSolved(puzzleInvalid.join(""), true);

        assert.isTrue(result.row);
    });

    test("Valid puzzle column placement", function(){
        let result = solver.canBeSolved(puzzleTest, true);

        assert.isNotTrue(result.column);
    });

    test("Invalid puzzle column placement", function(){
        let puzzleInvalid = Array.from(puzzleTestArray);
        puzzleInvalid[10] = "1";
        let result = solver.canBeSolved(puzzleInvalid.join(""), true);
        
        assert.isTrue(result.column);
    });

    test("Valid puzzle region placement", function(){
        let result = solver.canBeSolved(puzzleTest, true);

        assert.isNotTrue(result.region);
    });

    test("Invalid puzzle region placement", function(){
        let puzzleInvalid = Array.from(puzzleTestArray);
        puzzleInvalid[21] = "1";
        let result = solver.canBeSolved(puzzleInvalid.join(""), true);
        
        assert.isTrue(result.region);
    });

    test("Valid puzzle can be solved", function(){
        let result = solver.canBeSolved(puzzleTest);

        assert.isNotTrue(result);
    });

    test("Invalid puzzle can be solved", function(){
        let puzzleInvalid = Array.from(puzzleTestArray);
        puzzleInvalid[10] = "1";
        let result = solver.canBeSolved(puzzleInvalid.join(""));
        
        assert.isTrue(result);
    });

    test("valid puzzle solved", function(){
      assert.equal(solver.solve(puzzleTest), puzzleTestSolution);
    });
  });
});
