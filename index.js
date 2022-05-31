const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate');
const path = require('path');
const postRoutes = require('./routes/post');

const app = express();

// Sets & Uses
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(postRoutes);

async function start() {
    try {
        await mongoose.connect('mongodb://localhost:27017/user-post').then(() => console.log('Database connected...'));
        app.listen(3000, () => {
            console.log("Port 3000 is on...");
        });
    } catch (e) {
        console.log('ERROR');
        console.log(e);
    }
}

start();