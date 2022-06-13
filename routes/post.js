const { Router } = require('express');
const Post = require('../models/postSchema');
const Comm = require('../models/commentSchema');
const catchAsync = require('../utils/catchAsync');
const filter = require('../utils/filter');
const router = Router();



router.get('/', catchAsync(async (req, res, next) => {
    const posts = await Post.find({});
    res.render('posts/posts', {
        posts
    });
}));

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    let comments = [];

    if (post.hasComments) {
        const allComms = await Comm.find({});
        comments = filter(allComms, post);
    }

    res.render('posts/show', {
        post,
        comments
    });
}));

router.get('/:id/edit', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);

    res.render('posts/edit', {
        post,
        isPost: true
    });
}));

router.post('/', catchAsync(async (req, res, next) => {
    const post = new Post(req.body);
    await post.save();
    req.flash('success', 'New post successfully created!');
    res.redirect('/posts');
}));

router.put('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Post.findByIdAndUpdate(id, { ...req.body });
    req.flash('success', 'The post was successfully edited!');
    res.redirect(`/posts/${id}`);
}));

router.post('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    const comment = new Comm(req.body);
    comment.user = post;
    post.hasComments = true;

    await post.save();
    await comment.save();

    req.flash('success', 'Comment has been successfully published');
    res.redirect(`/posts/${id}`);
}));

router.delete('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);

    if (post.hasComments) {
        let allComms = await Comm.find({});
        let comments = filter(allComms, post);

        for (let comment of comments) {
            await Comm.findByIdAndDelete(comment._id);
        }
    }

    await Post.findByIdAndDelete(id);
    
    req.flash('success', 'Post successfully deleted!');
    res.redirect('/posts');
}));



module.exports = router;