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
let correctGuess = [];
let lettersGuessed = [];
let count = 8;

//setting up a session for each request to the page
app.use(session({
 secret: 'wool socks',
 resave: false,
 saveUninitalized: true
}));

//sets up the inital load of the page
app.get('/', function(req, res){
 // console.log(lettersGuessed);
 res.render('index', {wordToPlay, count});
 req.session.word = randomWord;
 console.log(wordToPlay);
});

//posts submissions from the guess form
//contains checkWord function to check
//the guess input against the mystery word
app.post('/', function(req, res){
  let guess = req.body.guess;
  checkWord(guess);
  res.render('index', {wordToPlay, correctGuess, lettersGuessed, count});
  console.log(lettersGuessed);
  console.log(req.body.guess);
  if (count === 0) {
    console.log('you lost!')
  }
})

//listens for port 3000 on local host
app.listen(port);

//function to check user input against mystery word letters
function checkWord(guess) {
  if (wordToPlay.includes(guess)) {
   correctGuess.push(guess);
   console.log(correctGuess);
   console.log('hell yea!')
 } else {
   lettersGuessed.push(guess);
   count--;
 }
}
