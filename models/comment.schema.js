const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    author: String,
    comment: String,
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model('Comment', commentSchema);