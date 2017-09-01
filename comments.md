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
