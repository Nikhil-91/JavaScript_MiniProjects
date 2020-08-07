class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    addBookList(book) {
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
        this.addToLocalStorage(book);
    }
    deleteBook(target) {
        if (window.confirm('Are you sure to delete? ')) {
            target.parentElement.parentElement.remove();
            this.showAlert('Book Deleted Successfully', 'error');
            this.deleteFromLocalStorage(target.parentElement.previousSibling.previousSibling);
        }
    }
    showAlert(msg, className) {
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(msg));
        document.querySelector('.container').insertBefore(div, document.querySelector('#book-form'));

        setTimeout(function () {
            document.querySelector('.alert').remove();
        }, 3000);
    }
    clearInputs() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    addToLocalStorage(book) {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    getBooksFromStorage() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        books.forEach(book => {
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
        });
    }

    deleteFromLocalStorage(target) {
        const input_text = Number(target.textContent);
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        books.forEach((element, index) => {
            if (Number(element.isbn) === input_text) {
                books.splice(index, 1);
            }
        })
        localStorage.setItem('books', JSON.stringify(books));
    }
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

document.addEventListener('DOMContentLoaded', function (e) {
    ui.getBooksFromStorage();
    e.preventDefault();
})
