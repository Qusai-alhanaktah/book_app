'use strict';
require('dotenv').config();
const express = require('express');
const server = express();
const cors = require('cors');
const methodOverride = require('method-override');

const superagent = require('superagent');
const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL);

const PORT = process.env.PORT || 3000;


server.use(express.urlencoded({ extended: true }));
server.use(methodOverride('_method'));
server.set('view engine', 'ejs')
server.use(express.static('./public'));

function handleError(error, response) {
    response.render('pages/error', { error: error });
}


server.get('/', getAllBooks);
server.get('/new', addBooks);
server.post('/search', searcheData);
server.post('/new', processAdd);
server.get('/books/:book_id', getSpecificBook);
server.post('/edit', edaitSelected);
server.put('/update/:book_id', updateBook);
server.delete('/delete/:book_id', deleteBook);



function updateBook(req,res){
    let { image_url, title, author, description, isbn, bookshelf } = req.body
    let SQL = 'UPDATE book SET image_url=$1, title=$2, author=$3, description=$4, isbn=$5, bookshelf=$6 WHERE id=$7;';
    let values = [image_url, title, author, description, isbn, bookshelf, req.params.book_id];
    client.query(SQL,values)
    .then(res.redirect(`/books/${req.params.book_id}`))
    .catch(err => handleError(err));
}




function deleteBook(req, res) {
    let SQL = 'DELETE FROM book WHERE id=$1';
    let values = [req.params.book_id];
    client.query(SQL, values)
        .then(res.redirect('/'))
        .catch(err => handleError(err));
}


function edaitSelected(req, res) {
    // console.log(req.body)
    res.render('pages/books/show', { book: req.body })
}

function getSpecificBook(req, res) {
    let SQL = `SELECT * FROM book WHERE id=$1`;
    let id = req.params.book_id;
    let values = [id];
    client.query(SQL, values)
        .then(data => {
            // console.log(data.rows)
            res.render('pages/books/detail', { book: data.rows[0] });
        }).catch(err => handleError(err));
}

function getAllBooks(req, res) {
    let SQL = `SELECT * FROM book;`;
    client.query(SQL)
        .then(data => {
            res.render('pages/index', { booksList: data.rows });
        }).catch(err => hanleError(err));
}
function addBooks(req, res) {
    res.render('pages/searches/new')
}
function processAdd(req, res) {
    // console.log(req.body)
    let { image_url, title, author, description, isbn, bookshelf } = req.body
    let SQL = `INSERT INTO book (image_url, title, author, description, isbn, bookshelf) VALUES ($1, $2, $3, $4, $5, $6)`
    let values = [image_url, title, author, description, isbn, bookshelf]

    client.query(SQL, values)
        .then(() => {
            res.redirect('/');
        }).catch(err => handleError(err));
}
function searcheData(req, res) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${req.body.select}+${req.body.input}`;
    superagent.get(url)
        .then(data => {
            let jsaonData = data.body.items;
            let book = jsaonData.map(data => new Book(data));
            res.render('pages/searches/show', { books: book });
        })
}
function Book(data) {
    this.title = data.volumeInfo.title ? data.volumeInfo.title : "No Title Available";
    this.image_url = (data.volumeInfo.imageLinks && data.volumeInfo.imageLinks.thumbnail) ? data.volumeInfo.imageLinks.thumbnail : "https://i.imgur.com/J5LVHEL.jpg";
    this.author = data.volumeInfo.authors ? data.volumeInfo.authors : "No Authors";
    this.description = data.volumeInfo.description ? data.volumeInfo.description : "No description available";
}

let message = "SORY YOU HAVE DO A MISTAKE"
server.get('*', (req, res) => {
    res.status(404).render('./pages/error', { 'message': message })
});

client.connect()
    .then(() => {
        server.listen(PORT, () => console.log(PORT, 'YAAAAAAA'));
    }).catch(err => handleError(err));
