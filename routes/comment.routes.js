const { Router } = require('express');
const Comment = require('../models/comment.schema');
const catchAsync = require('../middleware/catchAsync');
const { isLoggedIn } = require('../middleware/auth');
const router = Router();



router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    res.render('posts/edit', {
        comment,
        isPost: false
    });
}));

router.put('/:id', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { content } = req.body;
    const comment = await Comment.findByIdAndUpdate(id, { content }).populate('post', '_id');
    
    req.flash('success', 'Comment was successfully edited!');
    res.redirect(`/posts/${comment.post._id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const delComment = await Comment.findByIdAndDelete(id).populate('post', '_id');

    req.flash('success', 'Comment successfully deleted!');
    res.redirect(`/posts/${delComment.post._id}`);
}));


module.exports = router;