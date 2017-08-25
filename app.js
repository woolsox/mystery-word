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
let count = 8;

//setting up a session for each request to the page
app.use(session({
 secret: 'wool socks',
 resave: false,
 saveUninitalized: true
}));

//sets up the inital load of the page
app.get('/', function(req, res){
 res.render('index', {wordToPlay, wordDisplay, count});
 req.session.word = randomWord;
 console.log(wordToPlay);
 console.log('wordToPlay^');
 console.log(wordDisplay);
 console.log('wordDisplay^');
});

//posts submissions from the guess form
//contains checkWord function to check
//the guess input against the mystery word
app.post('/', function(req, res){
  let guess = req.body.guess.toLowerCase();
  checkWord(guess);
  gameOver();
  gameWon();
  res.render('index', {wordToPlay, wordDisplay, lettersGuessed, count, gameLose, gameWin});
})

//listens for port 3000 on local host
app.listen(port);

//function to check user input against mystery word letters
function checkWord(guess) {
  if (wordToPlay.includes(guess)) {
      let correctGuess = wordToPlay.indexOf(guess);
      while (~correctGuess) {
      hiddenWord[correctGuess] = guess;
      correctGuess = wordToPlay.indexOf(guess, correctGuess + 1);
      console.log(hiddenWord);
      console.log('hiddenWord^');
      console.log(correctGuess);
      console.log('correctGuess^');
      console.log(guess);
      console.log('guess^');
      console.log(hiddenWord.length);
      console.log('hiddenWord.length^');
    }
 } else {
   lettersGuessed.push(guess);
   count--;
 }
}

function gameOver() {
  if (count <= 0) {
    gameLose = "You've lost!"
    count = "No more guesses!"
  }
}

function gameWon() {
  if (hiddenWord === wordToPlay) {
    gameWin = "You've won!"
  }
}

// graveyard

// function revealLetters(guess) {
//   for (let i = 0; i < wordToPlay.length; i++) {
//     if (wordToPlay[i].includes(guess)) {
//       correctGuess.push(guess);
//       console.log(wordToPlay);
//       console.log('test');
//       console.log(correctGuess);
//       console.log(wordToPlay[i]);
//     }
//   }
// }

// counter w/ lose message
// if (count === 0) {
//   console.log('you lost!')
// }
