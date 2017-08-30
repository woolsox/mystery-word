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
let gameLose;
let gameWin;
let randomWord = words[Math.floor(Math.random() * words.length)];
let wordToPlay = [...randomWord];
let hiddenWord = [...randomWord];
let wordDisplay = hiddenWord.fill('');
let lettersGuessed = [];
let correctWords = [];
let count = 8;
let score = 0;
let nextWord = [];

//setting up a session for each request to the page
app.use(session({
 secret: 'wool socks',
 resave: false,
 saveUninitalized: true
}));

//sets up the inital load of the page
app.get('/', function(req, res){
 res.render('index', {wordToPlay, wordDisplay, count, score});
 req.session.word = randomWord;
});

//posts submissions from the guess form
//contains checkWord function to check
//the guess input against the mystery word
app.post('/', function(req, res){
  let guess = req.body.guess.toLowerCase();
  checkWord(guess);
  res.render('index', {wordToPlay, wordDisplay, lettersGuessed, count, gameLose, gameWin, correctWords, score, nextWord});
  gameWon();
})

//listens for port 3000 on local host
app.listen(port);

// function to compare user guess against the wordToPlay
// if user input matches any of the letters, they are
// assigned to the corresponding index
// position in the hiddenWord/wordDisplay
function checkWord(guess) {
 //checks if the word in play includes the users input
  if (wordToPlay.includes(guess)) {
      score++;
    // correctGuess is assignsed the index positions which
    // match the users input, in this case it grabs the first
    // of multiple matches, or just a single match if there's
    // only one possible match.
      let correctGuess = wordToPlay.indexOf(guess);
      // '~' operator checks if correctGuess is NOT equal to -1
      // when used in conjunction with 'while' I think it
      // iterates over for every instance which user input is equal to
      // multiple indices whose values greater than -1. In this case
      // it acts as a catch for any subsequent instances of matches being made.
      while (~correctGuess) {
      // displays matches on game board based on correct guesses/matched indices
      hiddenWord[correctGuess] = guess;
      // resets correctGuess value to -1 to break the while loop if
      // there are no more possible matches.
      correctGuess = wordToPlay.indexOf(guess, correctGuess + 1);
    }
 } else {
   // pushes incorrect guesses to be displayed
   lettersGuessed.push(guess);
   // reduces count by 1
   if (count > 1) {
    count--;
   }
   else {
    gameOver();
   }
 }
}

function gameOver() {
    gameWin = [];
    gameLose = "You've lost!"
    count = "0"
}

function gameWon() {
    if (!wordDisplay.includes('')) {
      generateNextWord();
      gameWin = "Nice work! Keep going!"
      count = 8;
    }
  }

// in progress...close to working, just need to make it clear
// the display for the next word. otherwise the correctWords list is working
function generateNextWord() {
  nextWord = "Next Word!"
  correctWords.push(randomWord);
  randomWord = [];
  randomWord = words[Math.floor(Math.random() * words.length)];
  wordToPlay = [...randomWord];
  hiddenWord = [...randomWord];
  wordDisplay = hiddenWord.fill('');
  lettersGuessed = [];
  gameWin = [];
}
