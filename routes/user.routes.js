const router = require('express').Router();
const passport = require('passport');
const catchAsync = require('../middleware/catchAsync');
const user = require('../controllers/user.controllers');

router.route('/register')
    .get(user.renderRegisterPage)
    .post(catchAsync(user.registerUser));

router.route('/login')
    .get(user.renderLoginPage)
    .post(passport.authenticate('local', {
    failureFlash: true,
    successRedirect: '/posts',
    failureRedirect: '/login'
    }));

router.get('/logout', user.logoutUser);


module.exports = router;