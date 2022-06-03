const { Router } = require('express');
const Post = require('../models/postSchema');
const Comm = require('../models/commentSchema');
const catchAsync = require('../utils/catchAsync');
const filter = require('../utils/filter');
const router = Router();



router.get('/', (req, res, next) => {
    res.render('home');
});

router.get('/posts', catchAsync(async (req, res, next) => {
    const posts = await Post.find({});
    res.render('posts/posts', {
        posts
    });
}));

router.get('/posts/:id', catchAsync(async (req, res, next) => {
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

router.get('/posts/:id/edit', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);

    res.render('posts/edit', {
        post,
        isPost: true
    });
}));

router.post('/posts', catchAsync(async (req, res, next) => {
    const post = new Post(req.body);
    await post.save();
    res.redirect('/posts');
}));

router.put('/posts/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Post.findByIdAndUpdate(id, { ...req.body });

    res.redirect(`/posts/${id}`);
}));

router.post('/posts/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);
    const comment = new Comm(req.body);
    comment.user = post;
    post.hasComments = true;

    await post.save();
    await comment.save();

    res.redirect(`/posts/${id}`);
}));

router.delete('/posts/:id', catchAsync(async (req, res, next) => {
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

    res.redirect('/posts');
}));

router.get('/comment/:id/edit', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const comment = await Comm.findById(id);
    res.render('posts/edit', {
        comment,
        isPost: false
    });
}));

router.put('/comment/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Comm.findByIdAndUpdate(id, { ...req.body });
    const { user } = await Comm.findById(id);

    res.redirect(`/posts/${user.toString()}`);
}));

router.delete('/comment/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { user } = await Comm.findById(id);
    const post = await Post.findById(user.toString());
    await Comm.findByIdAndDelete(id);

    let allComms = await Comm.find({});
    let comments = filter(allComms, post);

    if (!comments.length) {
        post.hasComments = false;
    }

    res.redirect(`/posts/${post._id}`);
}));


module.exports = router;