const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    author: String,
    comment: String,
    user: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    }
});

module.exports = mongoose.model('Comment', commentSchema);