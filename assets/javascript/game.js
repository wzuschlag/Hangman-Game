(function () {
    /* setup all vars needed for the game */
    var availableLetters, bikes, guess, lettersGuessed, 
        lettersMatched, lives, currentBike, 
        numLettersMatched, messages;

    function setup() {
        /* setup game parameters and Bike names and messages */
        availableLetters = "abcdefghijklmnopqrstuvwxyz";
        lives = 5;
        bikes = ["harley", "indian", "suzuki", "ducati", "yamaha", "triumph"];
        messages = {
            win: 'Your a winner, now get out and ride!!!',
            lose: 'Your a LOSER!!!',
            guessed: ' already guessed...',
            validLetter: 'Enter a letter from A-Z'
        };

        lettersGuessed = lettersMatched = "";
        numLettersMatched = 0;

        /* random generator to choose the hangman word */
        currentBike = bikes[Math.floor(Math.random() * bikes.length)];

        /* using document.getElementById to access the html page with data  */
        document.getElementById("count").innerHTML = "Starting with " + lives + " lives...Good luck!";
        document.getElementById("output").innerHTML = "";
        document.getElementById("outputrepeat").innerHTML = "";
        document.getElementById("bikepic").src = "assets/images/motorcycle-group.jpg";
        document.getElementById("letter").value = "";

        /* This is the guess button make sure its working and enabled */
        document.getElementById("letter").style.display = 'inline';
        document.getElementById("guess").style.display = 'inline';

        /* set up the display to show number of letter spaces of current bike word */
        document.getElementById("letters").innerHTML = '<li class="current-word">Guess the Bike:</li>';

        var letter, i;
        for (i = 0; i < currentBike.length; i++) {
            letter = '<li class="letter letter' + currentBike.charAt(i).toUpperCase() + '">' + currentBike.charAt(i).toUpperCase() + '</li>';
            document.getElementById("letters").insertAdjacentHTML('beforeend', letter);
        }
    }

    function gameOver(win) {
        if (win) {
            document.getElementById("output").innerHTML = messages.win;
            document.getElementById("output").classList.add('win');
            document.getElementById("bikepic").src = "assets/images/" + currentBike + ".jpg";
        } 
        else 
        {
            document.getElementById("output").innerHTML = messages.lose;
            document.getElementById("output").classList.add('error');
            document.getElementById("bikepic").src = "assets/images/biker-lost.jpg";
        }

        document.getElementById("letter").style.display = document.getElementById("guess").style.display = 'none';
        document.getElementById("letter").value = '';
    }

    /* Start game - should check for existing functions attached to window.onload */
    window.onload = setup();

    /* buttons - restart does a reset */
    document.getElementById("restart").onclick = setup;

    /* reset letter to guess on click */
    document.getElementById("letter").onclick = function () {
        this.value = '';
    };

    /* main guess function when user clicks #guess */
    document.getElementById('hangman').onsubmit = function (e) {
        if (e.preventDefault) e.preventDefault();
        document.getElementById("output").classList.remove('error', 'warning');
        guess = document.getElementById("letter").value;

        /* does guess have a value? if yes continue, if no, error */
        if (guess) {
            /* is guess a valid letter? if so keep going, else error */
            if (availableLetters.indexOf(guess) > -1) {
                /* has it been guessed (missed or matched) already? if so, abandon & add notice */
                if ((lettersMatched && lettersMatched.indexOf(guess) > -1) || (lettersGuessed && lettersGuessed.indexOf(guess) > -1)) 
                {
                    document.getElementById("outputrepeat").classList.add("warning");
                    $("#outputrepeat").prepend("<br><hr>" + '"' + guess.toUpperCase() + '"' + messages.guessed);
                }
                /* does guess exist in current word? if so, add to letters already matched, if final letter added, game over with win message */
                else if (currentBike.indexOf(guess) > -1) 
                {
                    var lettersToShow;
                    lettersToShow = document.querySelectorAll(".letter" + guess.toUpperCase());

                    for (var i = 0; i < lettersToShow.length; i++) {
                        lettersToShow[i].classList.add("correct");
                    }

                    /* check to see if letter appears multiple times */
                    for (var j = 0; j < currentBike.length; j++) {
                        if (currentBike.charAt(j) === guess) {
                            numLettersMatched += 1;
                        }
                    }

                    lettersMatched += guess;
                    if (numLettersMatched === currentBike.length) {
                        gameOver(true);
                    }
                }
                /* guess doesn't exist in current word and hasn't been guessed before, 
                add to lettersGuessed, reduce lives & update user */
                else 
                {
                    lettersGuessed += guess;
                    lives--;
                    document.getElementById("count").innerHTML = "You have " + lives + " lives left";
                    if (lives === 0) gameOver();
                }
            }
            /* error, if letter is not a valid letter */
            else 
            {
                document.getElementById("output").classList.add('error');
                document.getElementById("output").innerHTML = messages.validLetter;
            }
        }
        /* error, if no letter is entered by player */
        else 
        {
            document.getElementById("output").classList.add('error');
            document.getElementById("output").innerHTML = messages.validLetter;
        }
        return false;
    };
}());

