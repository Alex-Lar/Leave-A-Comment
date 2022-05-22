const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Post = require('./models/postschema');

mongoose.connect('mongodb://localhost:27017/user-post');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.render('home');
});

// Show All Posts
app.get('/posts', async (req, res) => {
    const posts = await Post.find({});
    res.render('posts/posts', { posts });
});

app.get('/posts/new', (req, res) => {
    res.render('posts/new');
});

// Show chosen post
app.get('/posts/:id', async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.render('posts/show', { post });
});

app.post('/posts', (req, res) => {
    console.log(req.body);
    res.send('New Posts are not available right now. Sorry...');
});

app.listen(3000, () => {
    console.log("Port 3000 is on...");
});