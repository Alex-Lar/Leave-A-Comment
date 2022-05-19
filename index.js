const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

mongoose.connect('mongodb://localhost:27017/test');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({
    extended: true
}));



app.get('/', (req, res) => {
    res.render('home');
});

app.get('/posts', (req, res) => {
    res.render('posts/posts');
});

app.listen(3000, () => {
    console.log("Port 3000 is on...");
});