const books = [];

const unreadBookTable = document.querySelector('tbody#unread-book-content');
const readBookTable = document.querySelector('tbody#read-book-content');

const bookIdElement = document.querySelector('input#book_id');
const bookTitleElement = document.querySelector('input#title');
const bookAuthorElement = document.querySelector('input#author');
const bookYearElement = document.querySelector('input#publish_year');
const bookIsCompleteElement = document.querySelector('input#is_complete');

const buttonActionDiv = document.querySelector('div#button-action');

const bookSubmitButton = document.querySelector('button#submit');
const bookResetButton = document.querySelector('button#reset');

const searchBookElement = document.querySelector('input#search');

function resetForm() {
  bookIdElement.value = '';
  bookTitleElement.value = '';
  bookAuthorElement.value = '';
  bookYearElement.value = '';
  bookIsCompleteElement.checked = false;

  buttonActionDiv.innerHTML = `
    <button id="submit" class="bg-green-500 hover:bg-green-600 text-white text-sm uppercase font-bold rounded transition-all py-2 px-5" onclick="insertBook()">Tambahkan</button>
    <button id="reset" class="bg-red-500 hover:bg-red-600 text-white text-sm uppercase font-bold rounded transition-all py-2 px-5" onclick="resetForm()">Reset</button>`;
}

function loadStorage() {
  const storageBooks = JSON.parse(localStorage.getItem('books') || '[]');
  books.length = 0;
  books.push(...storageBooks);
}

function writeStorage() {
  const booksData = JSON.stringify(books);
  localStorage.setItem('books', booksData);
}

function renderData() {
  unreadBookTable.innerHTML = '';
  readBookTable.innerHTML = '';
  let unreadBookCount = 1;
  let readBookCount = 1;

  for (let i = 0; i < books.length; i++) {
    const book = books[i];
    const searchQuery = searchBookElement.value;
    if (!book.title.toLowerCase().includes(searchQuery.toLowerCase())) continue;

    if (book.isComplete) {
      readBookTable.innerHTML += `
      <tr class="divide-x divide-gray-300 hover:bg-blue-50 text-center">
        <td class="p-2">${readBookCount}</td>
        <td class="p-2">${book.id}</td>
        <td class="p-2">${book.title}</td>
        <td class="p-2">${book.author}</td>
        <td class="p-2">${book.year}</td>
        <td class="flex flex-row justify-center gap-x-2 p-2">
          <button alt="Tandai belum dibaca" title="Tandai belum dibaca"><img src="assets/img/make_unread.svg" width="30" height="30" alt="make unread book" onclick="makeUnreadBook(${i})"></button>
          <button alt="Ubah data buku" title="Ubah data buku"><img src="assets/img/edit.svg" width="30" height="30" alt="edit book" onclick="loadBook(${i})"></button>
          <button alt="Hapus buku" title="Hapus buku"><img src="assets/img/delete.svg" width="30" height="30" alt="delete book" onclick="deleteBook(${i})"></button>
        </td>
      </tr>`;
      readBookCount++;
    } else {
      unreadBookTable.innerHTML += `
      <tr class="divide-x divide-gray-300 hover:bg-blue-50 text-center">
        <td class="p-2">${unreadBookCount}</td>
        <td class="p-2">${book.id}</td>
        <td class="p-2">${book.title}</td>
        <td class="p-2">${book.author}</td>
        <td class="p-2">${book.year}</td>
        <td class="flex flex-row justify-center gap-x-2 p-2">
          <button alt="Tandai sudah dibaca" title="Tandai sudah dibaca"><img src="assets/img/make_read.svg" width="30" height="30" alt="make read book" onclick="makeReadBook(${i})"></button>
          <button alt="Ubah data buku" title="Ubah data buku"><img src="assets/img/edit.svg" width="30" height="30" alt="edit book" onclick="loadBook(${i})"></button>
          <button alt="Hapus buku" title="Hapus buku"><img src="assets/img/delete.svg" width="30" height="30" alt="delete book" onclick="deleteBook(${i})"></button>
        </td>
      </tr>`;
      unreadBookCount++;
    }
  }
}

function insertBook() {
  const bookTitle = bookTitleElement.value;
  const bookAuthor = bookAuthorElement.value;
  const bookYearStr = bookYearElement.value;
  const isComplete = bookIsCompleteElement.checked;

  if (bookTitle == '') return alert('Judul buku belum diisi');
  if (bookAuthor == '') return alert('Penulis buku belum diisi');
  if (bookYearStr == '') return alert('Tahun terbit belum diisi');

  const bookYear = parseInt(bookYearStr);
  if (bookYear == NaN || bookYear <= 0) return alert('Tahun terbit tidak valid');

  books.push({
    id: +new Date(),
    title: bookTitle,
    author: bookAuthor,
    year: bookYear,
    isComplete,
  });

  writeStorage();
  renderData();
  resetForm();
}

function loadBook(index) {
  const book = books[index];

  bookIdElement.value = book.id;
  bookTitleElement.value = book.title;
  bookAuthorElement.value = book.author;
  bookYearElement.value = book.year;
  bookIsCompleteElement.checked = book.isComplete;

  buttonActionDiv.innerHTML = `
    <button id="update" class="bg-sky-500 hover:bg-sky-600 text-white text-sm uppercase font-bold rounded transition-all py-2 px-5" onclick="updateBook()">Perbarui</button>
    <button id="reset" class="bg-red-500 hover:bg-red-600 text-white text-sm uppercase font-bold rounded transition-all py-2 px-5" onclick="resetForm()">Reset</button>`;
}

function makeReadBook(index) {
  books[index].isComplete = true;
  writeStorage();
  renderData();
}

function makeUnreadBook(index) {
  books[index].isComplete = false;
  writeStorage();
  renderData();
}

function updateBook() {
  const bookId = bookIdElement.value;
  const bookTitle = bookTitleElement.value;
  const bookAuthor = bookAuthorElement.value;
  const bookYearStr = bookYearElement.value;
  const isComplete = bookIsCompleteElement.checked;

  if (bookTitle == '') return alert('Judul buku belum diisi');
  if (bookAuthor == '') return alert('Penulis buku belum diisi');
  if (bookYearStr == '') return alert('Tahun terbit belum diisi');

  const bookYear = parseInt(bookYearStr);
  if (bookYear == NaN || bookYear <= 0) return alert('Tahun terbit tidak valid');
  
  for (let i = 0; i < books.length; i++) {
    if (books[i].id == bookId) {
      books[i].title = bookTitle,
      books[i].author = bookAuthor;
      books[i].year = bookYear;
      books[i].isComplete = isComplete;

      writeStorage();
      renderData();
      break;
    }
  }

  resetForm();
}

function deleteBook(index) {
  books.splice(index, 1);
  writeStorage();
  renderData();
}

window.addEventListener('DOMContentLoaded', () => {
  loadStorage();
  renderData();
});

searchBookElement.addEventListener('input', renderData);