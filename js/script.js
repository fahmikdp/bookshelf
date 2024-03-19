/**
 * [
 *    {
 *      id: <int>
 *      title: <string>
 *      author: <string>
 *      year: <int>
 *      isComplete: <boolean>
 *    }
 * ]
 */

const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

const search = document.getElementById('search');

search.onkeyup = function() {
    console.log('Nilai input berubah menjadi: ' + myInput.value);
    // Lakukan sesuatu saat nilai input berubah
};

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
      id,
      title,
      author,
      year,
      isComplete
    }
  }

  function findBook(bookId) {
    for (const bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
  }

function findBookIndex(bookId) {
    for (const index in books) {
      if (books[index].id === bookId) {
        return index;
      }
    }
   
    return -1;
  }

function isStorageExist() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}


function makeBook(bookObject) {
  const {id, title, author, year, isComplete} = bookObject;

  const bookTitle = document.createElement('h2');
  bookTitle.innerText = title;
 
  const bookAuthor = document.createElement('p');
  bookAuthor.innerText = "Penulis: " + author;

  const bookYear = document.createElement('p');
  bookYear.innerText = "Tahun Terbit: " + year;
 
  const textContainer = document.createElement('div');
  textContainer.classList.add('inner');
  textContainer.append(bookTitle, bookAuthor, bookYear);
 
  const container = document.createElement('div');
  container.classList.add('item', 'shadow');
  container.append(textContainer);
  container.setAttribute('id', `todo-${id}`);

  if (isComplete) {
    const undoButton = document.createElement('button');
    undoButton.classList.add('undo-button');
    undoButton.addEventListener('click', function () {
      undoBookFromCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
    if (window.confirm("Apakah anda yakin ingin menghapus buku dari daftar?")){
        removeBookFromCompleted(id);
        alert("Buku berhasil dihapus");
    } else {
        console.log("Aksi dibatalkan!");
    }
    
    });

    container.append(undoButton, trashButton);
  } else {

    const checkButton = document.createElement('button');
    checkButton.classList.add('check-button');
    checkButton.addEventListener('click', function () {
      addTaskToCompleted(id);
    });

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
    if (window.confirm("Apakah anda yakin ingin menghapus buku dari daftar?")){
        removeBookFromCompleted(id);
        alert("Buku berhasil dihapus");
    } else {
        console.log("Aksi dibatalkan!");
    }
    });

    container.append(checkButton, trashButton);
  }

  return container;
}

function addBook() {
    const titleBook = document.getElementById('title').value;
    const authorBook = document.getElementById('penulis').value;
    const yearBook = parseInt(document.getElementById('year').value);
    
    const generatedID = generateId();
    const bookObject = generateBookObject(generatedID, titleBook, authorBook, yearBook, false);
    books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addTaskToCompleted (bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);
   
    if (bookTarget === -1) return;
   
    books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
   
    if (bookTarget == null) return;
   
    bookTarget.isComplete = false
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener('DOMContentLoaded', function () {

  const submitForm = document.getElementById('form');

  submitForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});

function displayBooks(books) {
  const uncompletedBOOKList = document.getElementById('books');
  const listCompleted = document.getElementById('completed-books');
    listCompleted.innerHTML = '';
    uncompletedBOOKList.innerHTML = '';

    books.forEach(bookItem => {
        const bookElement = makeBook(bookItem);
        if (bookItem.isComplete) {
            listCompleted.append(bookElement);
        } else {
            uncompletedBOOKList.append(bookElement);
        }
    });
}

document.addEventListener(RENDER_EVENT, function () {

    displayBooks(books);

    const search = document.getElementById('search');
    search.onkeyup = function() {
        const keyword = search.value.toLowerCase();

        const filteredBooks = books.filter(book => {
            return book.title.toLowerCase().includes(keyword) || 
                book.author.toLowerCase().includes(keyword) || 
                book.year.toString().includes(keyword);
        });

        displayBooks(filteredBooks);
    };

})