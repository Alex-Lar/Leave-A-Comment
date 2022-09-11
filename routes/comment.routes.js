const { Router } = require('express');
const catchAsync = require('../middleware/catchAsync');
const { isLoggedIn, isCommentAuthor } = require('../middleware/auth');
const comment = require('../controllers/comment.controllers');
const router = Router();

router.get('/:id/edit', isLoggedIn, isCommentAuthor, catchAsync(comment.renderEdit));

router.route('/:id')
    .put(isLoggedIn, isCommentAuthor, catchAsync(comment.editComment))
    .delete(isLoggedIn, isCommentAuthor, catchAsync(comment.deleteComment));


module.exports = router;