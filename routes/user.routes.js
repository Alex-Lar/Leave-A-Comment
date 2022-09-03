const router = require('express').Router();
const User = require('../models/user.schema');
const passport = require('passport');
const catchAsync = require('../middleware/catchAsync');
const ExpressError = require('../utils/expressError');

router.get('/register', (req, res, next) => {
    res.render('auth/register');
});

router.get('/login', (req, res, next) => {
    res.render('auth/login');
});

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const {username, password} = req.body;

        if (!username || !password) {
            req.flash('error', 'Something went wrong! Try again!');
            return res.redirect('/register')
        }
        
        const user = new User({username, password});
        const regUser = await User.register(user, password);

        req.login(regUser, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Post&Comment!');
            res.redirect('/posts');
        });
    } catch (error) {
        req.flash('error', error.message);
        res.redirect('/register');
    }
}));

router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    successRedirect: '/posts',
    failureRedirect: '/login'
}));

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) return next(err);
        req.flash('success', 'Goodbye!')
        res.redirect('/');
    })
});


module.exports = router;