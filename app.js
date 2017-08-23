const express = require('express');
const session = require('express-session');
const mustache = require('mustache-express');
const body = require('body-parser');
const port = 3000;
const app = express();
const fs = require('fs');
const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

//start the engine, set the views, and use body-parser
app.engine('mustache', mustache());
app.set('views', './views');
app.set('view engine', 'mustache');
app.use(body.json());
app.use(body.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));

//variables for usage in the game
let randomWord = words[Math.floor(Math.random() * words.length)];
let wordToPlay = [...randomWord];
let lettersGuessed = [];
let count = 8;

//setting up a session for each request to the page
app.use(session({
 secret: 'foo_bar',
 resave: false,
 saveUninitalized: true
}));

app.get('/', function(req, res){
 res.render('index', {wordToPlay});
 req.session.word = randomWord;
});

app.post('/', function(req, res){
  let guess = req.body.guess;
  checkWord(guess);
  res.render('index', {wordToPlay, lettersGuessed, count});
  console.log(lettersGuessed);
  console.log(guess)
  console.log('app.post ^');
})

app.listen(port);

function checkWord(guess) {
  if (wordToPlay.includes(guess)) {
   console.log('hell yea!')
  } else {
   lettersGuessed.push(guess);
   count--;
   console.log(lettersGuessed);
   console.log(guess)
   console.log('checkWord^');
  }
}
