// Initialize variables

let min = 1,
    max = 10,
    winningNumber = getRandomNum(min, max),
    guessLeft = 3;

// Read UI elements
const game = document.querySelector('.game'),
    minNum = document.querySelector('.min-num'),
    maxNum = document.querySelector('.max-num'),
    guessInput = document.querySelector('#guess-input'),
    guessBtn = document.querySelector('#guess-btn'),
    message = document.querySelector('.message');

// Dynamically set min and max
minNum.textContent = min;
maxNum.textContent = max;

// getRandomNumber
function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + 1);
}

// Event Listener
guessBtn.addEventListener('click', function () {

    const guess = parseInt(guessInput.value);

    if (isNaN(guess) || guess < min || guess > max) {
        setMessage(`Please enter number between ${min} and ${max}`, 'red');
    }

    if (guess === winningNumber) {
        gameOver(true, `${winningNumber} is correct! You won`)
    }
    else {
        guessLeft -= 1;
        if (guessLeft === 0) {
            gameOver(false, `You Lost, The correct number was ${winningNumber}`);
        }
        else {
            guessInput.value = '';
            guessInput.style.borderColor = 'red';
            setMessage(`${guess} incorrect, ${guessLeft} guesses left`, 'red');
        }
    }

})

function setMessage(msg, color) {
    message.textContent = msg;
    message.style.color = color;
}

function gameOver(won, msg) {
    let color;
    won === true ? color = 'green' : color = 'red';
    setMessage(msg, color);
    guessInput.disabled = true;
    guessInput.style.borderColor = color;

    guessBtn.value = 'Play Again';
    guessBtn.className = 'play-again';
}

// Play Again Event listner

guessBtn.addEventListener('mousedown', function (e) {
    if (e.target.className === 'play-again') {
        window.location.reload();
    }
})
