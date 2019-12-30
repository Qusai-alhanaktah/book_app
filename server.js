'sue strict';
const express = require('express');
const server = express();
const cors = require('cors');


const superagent = require('superagent');
require('dotenv').config();

const PORT = process.env.PORT || 3000; 

server.set('view engine','ejs')
server.use("/public", express.static('public'));
server.use(express.urlencoded());

server.get('/', (req,res)=>{
    res.render('./pages/index', {'data':word})
});
let word = "Hi!!!";
server.get('/test',(req,res)=>{
    res.render('./pages/index', {'data':word})
})

server.post('/searches', (req,res)=>{
        console.log(req);
        // let query = res.query
        const url = `https://www.googleapis.com/books/v1/volumes?q=${req.body.select}+${req.body.input}`;
        superagent.get(url)
           .then(data =>{
            //    console.log(JSON.parse(data.text))
               let jsaonData = JSON.parse(data.text).items;
               let book = jsaonData.map(data => new Book(data))
               res.send(book)
            })
})
function Book(data){
    this.kind = data.kind;
    this.id = data.id;
    this.etag = data.etag;
    this.selfLink = data.selfLink;
    this.title = data.volumeInfo.title;
    this.authors = data.volumeInfo.authors;
}



let message = "SORY YOU HAVE DO A MISTAKE"
server.get('*', (req,res)=>{
    res.status(404).render('./pages/error', {'message':message})
});


server.listen(PORT, ()=>console.log(PORT,'YAAAAAAA'));
