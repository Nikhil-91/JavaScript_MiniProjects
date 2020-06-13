//Define variables
let min = 1;
max = 10;
win_num = getRandomVal(max, min);
guess_left = 3;
total_chances = 3

//Read UI properties
const number = document.querySelector('#number');
const btn = document.querySelector('#btn1');
const min_item = document.querySelector('.min');
const max_item = document.querySelector('.max');
const msg = document.querySelector('.message');

//dynamically set values to UI
min_item.textContent = min;
max_item.textContent = max;

btn.addEventListener('click', function (e) {
    if (number.value == NaN || number.value < min || number.value > max) {
        err_msg = `Please enter a number between ${min} and ${max}`;
        alertMessage(err_msg, 'text-danger')
    } else {
        guess_left -= 1;
        console.log(win_num)
        if (number.value == win_num) {
            alert_msg = `${win_num} is correct,You Won!!!!`;
            alertMessage(alert_msg, 'text-success');
            btn.textContent = 'Play again'
            btn.classList.add('play-again')
            document.querySelector('.play-again').addEventListener('mousedown', function () {
                window.location.reload();
            })
        } else if (guess_left == 0) {
            alert_msg = `You Lost, Please try again`;
            alertMessage(alert_msg, 'text-danger');
            btn.textContent = 'Play again'
            btn.classList.add('play-again')
            document.querySelector('.play-again').addEventListener('mousedown', function () {
                window.location.reload();
            })
        } else {

            alert_msg = `You have, ${guess_left} out of ${total_chances} left`;
            alertMessage(alert_msg, 'text-danger');
        }
    }
    number.value = ''
})

function getRandomVal(max, min) {
    return Math.floor(Math.random() * max, min);

}

function alertMessage(msg, className) {
    let alert_message = document.querySelector('#message');
    alert_message.innerText = msg;
    alert_message.className = `${className}`


}

