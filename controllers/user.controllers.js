const User = require('../models/user.schema');

module.exports.renderRegisterPage = (req, res, next) => {
    res.render('auth/register');
}

module.exports.renderLoginPage = (req, res, next) => {
    res.render('auth/login');
};

module.exports.registerUser = async (req, res, next) => {
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
};

module.exports.logoutUser = (req, res, next) => {
    req.logout(function(err) {
        if (err) return next(err);
        req.flash('success', 'Goodbye!')
        res.redirect('/');
    })
};