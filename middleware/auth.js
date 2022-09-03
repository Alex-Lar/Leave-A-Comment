module.exports.isLoggedIn = (req, res, next) => {
    if (!req.user) {
        req.flash('error', 'Before using the service you need to log in');
        return res.redirect('/login')
    }
    next();
};
