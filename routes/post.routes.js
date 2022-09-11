const { Router } = require('express');
const catchAsync = require('../middleware/catchAsync');
const { isLoggedIn, isAuthor } = require('../middleware/auth');

const post = require('../controllers/post.controllers');
const router = Router();


router.route('/')
    .get(catchAsync(post.index))
    .post(isLoggedIn, catchAsync(post.createPost));

router.get('/create', isLoggedIn, post.renderCreatePage);

router.route('/:id')
    .get(catchAsync(post.renderShowPage))
    .put(isLoggedIn, isAuthor, catchAsync(post.editPost))
    .post(isLoggedIn, catchAsync(post.createComment))
    .delete(isLoggedIn, isAuthor, catchAsync(post.deletePost));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(post.renderEditPage));




module.exports = router;