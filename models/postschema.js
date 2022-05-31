const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    title: String,
    author: String,
    text: String
});

module.exports = mongoose.model('Post', postSchema);