document.querySelector('#name').addEventListener('blur', function (e) {
    const input_text = document.querySelector("#name");
    let re = /^[a-zA-Z]{2,18}$/;
    if (re.test(input_text.value)) {
        input_text.classList.add('is-valid');
        input_text.classList.remove('is-invalid');
    } else {
        input_text.classList.remove('is-valid');
        input_text.classList.add('is-invalid');
    }
    console.log(input_text.classList)
    e.preventDefault();
})

document.querySelector('#zipcode').addEventListener('blur', function (e) {
    const input_text = document.querySelector("#zipcode");
    let re = /^[0-9]{5}(-[0-9]{4})?$/;
    if (re.test(input_text.value)) {
        input_text.classList.add('is-valid');
        input_text.classList.remove('is-invalid');
    } else {
        input_text.classList.remove('is-valid');
        input_text.classList.add('is-invalid');
    }
    console.log(input_text.classList)
    e.preventDefault();
})


document.querySelector('#email').addEventListener('blur', function (e) {
    const input_text = document.querySelector("#email");
    let re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
    if (re.test(input_text.value)) {
        input_text.classList.add('is-valid');
        input_text.classList.remove('is-invalid');
    } else {
        input_text.classList.remove('is-valid');
        input_text.classList.add('is-invalid');
    }
    console.log(input_text.classList)
    e.preventDefault();
})

document.querySelector('#pname').addEventListener('blur', function (e) {
    const input_text = document.querySelector("#pname");
    let re = /^\(?\d{3}\)?[-. ]?\d{3}[-. ]?\d{4}$/;
    if (re.test(input_text.value)) {
        input_text.classList.add('is-valid');
        input_text.classList.remove('is-invalid');
    } else {
        input_text.classList.remove('is-valid');
        input_text.classList.add('is-invalid');
    }
    console.log(input_text.classList)
    e.preventDefault();
})