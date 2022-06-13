const express = require('express');
const mongoose = require('mongoose');
const engine = require('ejs-mate');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');

const methodOverride = require('method-override');
const ExpressError = require('./utils/expressError');

const postRoutes = require('./routes/post');
const commRoutes = require('./routes/comment');

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

// Flash middleware
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    next();
});


app.get('/', (req, res, next) => {
    res.render('home');
});

app.use('/posts', postRoutes);
app.use('/comment', commRoutes);


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
        await mongoose.connect('mongodb://localhost:27017/user-post')
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