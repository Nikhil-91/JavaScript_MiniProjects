// Load UI elements
const amount = document.querySelector('#amount');
const interest = document.querySelector('#interest');
const years = document.querySelector('#years');
const monthlyPayment = document.querySelector('#monthly-payment');
const totalPayment = document.querySelector('#total-payment');
const totalInterest = document.querySelector('#total-interest');

// Hiding result section
document.querySelector('.results').style.display = 'none';

// Loading image
function loadImage() {
    document.querySelector('.loading').style.display = "block";
    document.querySelector('.results').style.display = 'none';
    setTimeout(function () {
        document.querySelector('.loading').style.display = "none";
        document.querySelector('.results').style.display = 'block';
    }, 2000)
}

// Event Listeners
document.querySelector('#submit').addEventListener('click', calculateLoanAmount);

function calculateLoanAmount(e) {
    const principal = parseFloat(amount.value);
    const calculatedInterest = parseFloat(interest.value) / 100 / 12;
    const calculatedPayments = parseFloat(years.value) * 12;

    // Compute monthly payment
    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (principal * x * calculatedInterest) / (x - 1);

    if (isFinite(monthly)) {
        monthlyPayment.value = monthly.toFixed(2);
        totalPayment.value = (monthly * calculatedPayments).toFixed(2);
        totalInterest.value = ((monthly * calculatedPayments) - principal).toFixed(2);
        loadImage();

    } else {
        showError('Please check your numbers');
    }
    e.preventDefault();
}

function showError(error) {
    const errordiv = document.createElement('div');
    errordiv.className = 'alert alert-danger';
    errordiv.appendChild(document.createTextNode(error));

    document.querySelector('.card').insertBefore(errordiv, document.querySelector('.heading'));

    setTimeout(function () {
        document.querySelector('.alert').remove();
    }, 3000);
}
