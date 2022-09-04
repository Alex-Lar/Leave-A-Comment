const express = require('express');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

const methodOverride = require('method-override');
const ExpressError = require('./utils/expressError');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.schema');

const userRoute = require('./routes/user.routes');
const postRoute = require('./routes/post.routes');
const commentRoute = require('./routes/comment.routes');

const app = express();


// Sets & Uses
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


// Session config
const sessionConfig = {
    secret: 'verysecretstring',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
};

app.use(session(sessionConfig));
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.warning = req.flash('warning');
    res.locals.error = req.flash('error');
    next();
});


app.get('/', (req, res, next) => {
    res.render('home');
});

app.use('/', userRoute);
app.use('/posts', postRoute);
app.use('/comment', commentRoute);


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    
    if (!err.message) {
        err.message = 'Something Went Wrong...';
    }

    res.status(statusCode).render('error', { err });
});

async function start() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/user-post')
        .then(() => console.log('Database connected...'));

        app.listen(3000, () => {
            console.log("Port 3000 is on...");
        });
    } catch (e) {
        console.log('ERROR');
        console.log(e);
    }
}

start();