require('dotenv').config();
const express     = require('express');
const bodyParser  = require('body-parser');
const expect      = require('chai').expect;
const cors        = require('cors');

const fccTestingRoutes  = require('./routes/fcctesting.js');
const apiRoutes         = require('./routes/api.js');
const runner            = require('./test-runner');
const SudokuSolver      = require('./controllers/sudoku-solver.js');

let solver = new SudokuSolver();

const app = express();

app.use('/public', express.static(process.cwd() + '/public'));
app.use(cors({origin: '*'})); //For FCC testing purposes only

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/api/check", function(req, res, next){
  let validate = solver.validate(req.body);
  let error;
  
  if(validate.charactersTest){
    error = "Invalid characters in puzzle";
  }else if(validate.lengthTest){
    error = "Expected puzzle to be 81 characters long";
  }else if(validate.coordinateTest){
    error = "Invalid coordinate";
  }else if(validate.valueTest){
    error = "Invalid value";
  }else if(validate.allFieldsTest){ 
    error = "Required field(s) missing";
  };

  if(error){
    res.json({error});
  }else{
    next();
  }
})
app.post("/api/solve", function(req, res, next){
  let validate = solver.validate(req.body);
  let error;

  if(validate.fieldsTest.puzzle){ 
    error = "Required field missing";
  }else if(validate.charactersTest){
    error = "Invalid characters in puzzle";
  }else if(validate.lengthTest){
    error = "Expected puzzle to be 81 characters long";
  }else if(validate.canBeSolved){
    error = "Puzzle cannot be solved"
  }

  if(error){
    res.json({error});
  }else{
    next();
  };
})

//Index page (static HTML)
app.route('/')
  .get(function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
  });

//For FCC testing purposes
fccTestingRoutes(app);

// User routes
apiRoutes(app);
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
const PORT = process.env.PORT || 3000
app.listen(PORT, function () {
  console.log("Listening on port " + PORT);
  // process.env.NODE_ENV='test'
  if (process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch (error) {
        console.log('Tests are not valid:');
        console.error(error);
      }
    }, 1500);
  }
});

module.exports = app; // for testing
