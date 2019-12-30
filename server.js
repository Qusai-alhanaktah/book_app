'sue strict';
const express = require('express');
const server = express();
const cors = require('cors');

const superagent = require('superagent');
require('dotenv').config();

const PORT = process.env.PORT || 3000; 

server.set('view engine','ejs')
server.use("/public", express.static('public'));

server.get('/', (request,response)=>{
    response.status(200).send('it is worrrrk')
});
let word = "HELO WORLD!!!!!!!!";
server.get('/test',(req,res)=>{
    res.render('./pages/index', {'data':word})
})
server.listen(PORT, ()=>console.log(PORT,'YAAAAAAA'));
