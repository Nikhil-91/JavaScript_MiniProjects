function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
}

function UI() { }

UI.prototype.addBookList = function (book) {
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');
    row.innerHTML =
        `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="delete-item">x</a></td>
    `;
    list.appendChild(row);
    this.showAlert('Book Added Successfully', 'success');
}

UI.prototype.deleteBook = function (target) {
    if (window.confirm('Are you sure to delete? ')) {
        target.parentElement.parentElement.remove();
        this.showAlert('Book Deleted Successfully', 'error');
    }
}

UI.prototype.showAlert = function (msg, className) {
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(msg));
    document.querySelector('.container').insertBefore(div, document.querySelector('#book-form'));

    setTimeout(function () {
        document.querySelector('.alert').remove();
    }, 3000);
}

UI.prototype.clearInputs = function () {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = '';
    document.querySelector('#isbn').value = '';
}

const ui = new UI();

document.getElementById('book-form').addEventListener('submit', function (e) {
    // Read UI elements
    const title = document.querySelector('#title');
    const author = document.querySelector('#author');
    const isbn = document.querySelector('#isbn');

    const book = new Book(title.value, author.value, isbn.value);



    if (title.value === '' || author.value === '' || isbn.value === '') {
        ui.showAlert('Please fill all the fields', 'error');
    }
    else {
        ui.addBookList(book);

        ui.clearInputs();
    }


    e.preventDefault();
})


document.getElementById('book-list').addEventListener('click', function (e) {

    if (e.target.className === 'delete-item') {

        ui.deleteBook(e.target);
    }

    e.preventDefault();
})

