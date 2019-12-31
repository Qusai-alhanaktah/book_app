'sue strict';
const express = require('express');
const server = express();
const cors = require('cors');


const superagent = require('superagent');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

server.set('view engine', 'ejs')
server.use(express.static('public'));
server.use(express.urlencoded({ extended: true }));

server.get('/', (req, res) => {
    res.render('pages/index')
});


server.post('/searches', (req, res) => {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${req.body.select}+${req.body.input}`;
    console.log(url);
    superagent.get(url)
        .then(data => {
            let jsaonData = data.body.items;
            let book = jsaonData.map(data => new Book(data));
            res.render('pages/searches/show', {books:book});
        })
})
function Book(data) {
    this.title = data.volumeInfo.title? data.volumeInfo.title: "No Title Available";
    this.imgUrl = (data.volumeInfo.imageLinks && data.volumeInfo.imageLinks.thumbnail) ? data.volumeInfo.imageLinks.thumbnail:"https://i.imgur.com/J5LVHEL.jpg";
    this.authors = data.volumeInfo.authors? data.volumeInfo.authors: "No Authors";
    this.desc = data.volumeInfo.description? data.volumeInfo.description:"No description available";
}



let message = "SORY YOU HAVE DO A MISTAKE"
server.get('*', (req, res) => {
    res.status(404).render('./pages/error', { 'message': message })
});


server.listen(PORT, () => console.log(PORT, 'YAAAAAAA'));
