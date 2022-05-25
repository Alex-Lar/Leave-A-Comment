const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const path = require('path');
const Post = require('./models/postschema');

mongoose.connect('mongodb://localhost:27017/user-post');

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log("Database connected");
});

const app = express();

// Sets & Uses
app.engine('ejs', engine);

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Routes
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

// Show edit page
app.get('/posts/:id/edit', async (req, res) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    res.render('posts/edit', { post });
});

app.post('/posts', async (req, res) => {
    const post = new Post(req.body);
    await post.save();
    res.redirect('/posts');
});

// Find and Update post
app.put('/posts/:id', async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndUpdate(id, { ...req.body });
    res.redirect(`/posts/${id}`);
});

// Delete post
app.delete('/posts/:id', async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.redirect('/posts');
});

// If page is not found
app.get('*', (req, res) => {
    res.render('error');
});




app.listen(3000, () => {
    console.log("Port 3000 is on...");
});