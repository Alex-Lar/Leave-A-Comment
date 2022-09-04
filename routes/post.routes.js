const { Router } = require('express');
const catchAsync = require('../middleware/catchAsync');
const { isLoggedIn, isAuthor } = require('../middleware/auth');

const User = require('../models/user.schema');
const Post = require('../models/post.schema');
const Comment = require('../models/comment.schema');

const router = Router();


router.get('/', catchAsync(async (req, res, next) => {
    const posts = await Post.find({}).populate('author', 'username');
    res.render('posts/posts', {
        posts
    });
}));

router.get('/create', isLoggedIn, (req, res, next) => {
    res.render('posts/create');
});

router.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate('author', 'username');

    const comments = await Comment.findPostComments(post._id);

    res.render('posts/show', {
        post,
        comments
    });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);

    res.render('posts/edit', {
        post,
        isPost: true
    });
}));

router.post('/', isLoggedIn, catchAsync(async (req, res, next) => {
    const { title, content } = req.body;

    if (!title || !content) {
        req.flash('error', 'Both input fields must be filled in!')
        return res.redirect('/posts/create');
    }

    const post = new Post({title, content});
    post.author = req.user._id;
    await post.save();

    req.flash('success', 'New post successfully created!');
    res.redirect('/posts');
}));

router.put('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Post.findByIdAndUpdate(id, { ...req.body });
    req.flash('success', 'The post was successfully edited!');
    res.redirect(`/posts/${id}`);
}));

// create comment
router.post('/:id', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { content } = req.body;

    const post = await Post.findById(id);
    const newComment = new Comment({content});

    newComment.post = post._id;
    newComment.author = req.user._id;

    await post.save();
    await newComment.save();

    req.flash('success', 'Comment has been successfully published');
    res.redirect(`/posts/${id}`);
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Comment.deletePostComments(id);
    await Post.findByIdAndDelete(id);
    
    req.flash('success', 'Post successfully deleted!');
    res.redirect('/posts');
}));



module.exports = router;