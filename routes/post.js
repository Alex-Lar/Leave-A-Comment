const { Router } = require('express');
const Post = require('../models/postschema');
const Comm = require('../models/commentSchema');
const router = Router();


router.get('/', (req, res) => {
    try {
        res.render('home');   
    } catch (error) {
        console.log(error);
    }
});

router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find({});
        res.render('posts/posts', { posts });   
    } catch (error) {
        console.log(error);
    }
});

router.get('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        res.render('posts/show', { post });   
    } catch (error) {
        console.log(error);
    }
});

router.get('/posts/:id/edit', async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);
        res.render('posts/edit', { post });   
    } catch (error) {
        console.log(error);
    }
});

router.post('/posts', async (req, res) => {
    try {
        const post = new Post(req.body);
        await post.save();
        res.redirect('/posts');   
    } catch (error) {
        console.log(error);
    }
});

router.put('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Post.findByIdAndUpdate(id, { ...req.body });
        res.redirect(`/posts/${id}`);   
    } catch (error) {
        console.log(error);
    }
});

router.post('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await Post.findById(id);
        const comment = new Comm(req.body);
        comment.user = user;

        console.log(comment);
        await comment.save();
        res.redirect(`/posts/${id}`);   
    } catch (error) {
        console.log(error);
    }
});

router.delete('/posts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Post.findByIdAndDelete(id);
        res.redirect('/posts');   
    } catch (error) {
        console.log(error);
    }
});

router.get('*', (req, res) => {
    res.render('error');
});


module.exports = router;