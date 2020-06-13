//Define UI Variables
const book_input = document.querySelector('#book_input');
const author_input = document.querySelector('#author_input');
const ISDN_input = document.querySelector('#ISDN_input');
const btn = document.querySelector('#btn1');

//Define constructor
function Book_Management(title, author, isdn) {
    this.title = title;
    this.author = author;
    this.isdn = isdn;
}

Book_Management.prototype.addBookDetails = function () {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td> ${this.title}</td>
   <td> ${this.author}</td>
   <td> ${this.isdn}</td>
    <td><a href='#' class='delete-item'>x</a></td>
   `;
    document.querySelector('#table_body').appendChild(tr);
}



//Read inputs from UI and add to object
btn.addEventListener('click', function (e) {
    const title = book_input.value;
    const author = author_input.value;
    const isdn = ISDN_input.value;
    if (title == '' || author == '' || isdn == '') {
        alert('Please enter the details to proceed')
    }
    else {
        const book = new Book_Management(title, author, isdn);
        book.addBookDetails();
        onAddLocalStorage(book);
        book_input.value = '';
        author_input.value = '';
        ISDN_input.value = '';
        alertMessage(`Book Details Added Successfully`, 'alert-success')
    }

    e.preventDefault();

})

//Remove selected item
document.addEventListener('click', function (e) {
    if (e.target.className == 'delete-item') {
        e.target.parentElement.parentElement.remove();
        ondeleteLocalStorage(e.target.parentElement.previousElementSibling.textContent)
        alertMessage(`Book Details Deleted Successfully`, 'alert-danger')
    }
})

alertMessage = function (msg, className) {
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.textContent = msg;
    document.querySelector('#main-class').insertBefore(div, document.querySelector('.heading'))
    clearMessage();

}

clearMessage = function () {
    setTimeout(function () {
        document.querySelector('.alert').remove();
    }, 2000)
}

onAddLocalStorage = function (task) {
    let book_tasks;
    if (localStorage.getItem('book_tasks') == null) {
        book_tasks = [];
    } else {

        book_tasks = JSON.parse(localStorage.getItem('book_tasks'));
    }

    book_tasks.push(task)
    localStorage.setItem('book_tasks', JSON.stringify(book_tasks));
}

ondeleteLocalStorage = function (isdn_no) {
    let book_tasks;
    if (localStorage.getItem('book_tasks') == null) {
        book_tasks = [];
    } else {

        book_tasks = JSON.parse(localStorage.getItem('book_tasks'));
    }
    isdn_no = isdn_no.trim();
    for (item in book_tasks) {

        if (book_tasks[item]['isdn'] === isdn_no) {
            book_tasks.splice(item, 1);
        }
    }
    localStorage.setItem('book_tasks', JSON.stringify(book_tasks));
}



document.addEventListener('DOMContentLoaded', function () {
    let book_tasks;
    if (localStorage.getItem('book_tasks') == null) {
        book_tasks = [];
    } else {

        book_tasks = JSON.parse(localStorage.getItem('book_tasks'));
    }
    book_tasks.forEach((obj) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td> ${obj.title}</td>
    <td> ${obj.author}</td>
    <td> ${obj.isdn}</td>
        <td><a href='#' class='delete-item'>x</a></td>
    `;
        document.querySelector('#table_body').appendChild(tr);
    });
})

