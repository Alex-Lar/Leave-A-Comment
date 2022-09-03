const { Router } = require('express');
const Post = require('../models/post.schema');
const Comm = require('../models/comment.schema');
const catchAsync = require('../middleware/catchAsync');
const { isLoggedIn } = require('../middleware/auth');
const filter = require('../utils/filter');
const router = Router();



router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const comment = await Comm.findById(id);
    res.render('posts/edit', {
        comment,
        isPost: false
    });
}));

router.put('/:id', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Comm.findByIdAndUpdate(id, { ...req.body });
    const { user } = await Comm.findById(id);

    req.flash('success', 'Comment was successfully edited!');
    res.redirect(`/posts/${user.toString()}`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { user } = await Comm.findById(id);
    const post = await Post.findById(user.toString());
    await Comm.findByIdAndDelete(id);

    let allComms = await Comm.find({});
    let comments = filter(allComms, post);

    if (!comments.length) {
        post.hasComments = false;
    }

    req.flash('success', 'Comment successfully deleted!');
    res.redirect(`/posts/${post._id}`);
}));


module.exports = router;