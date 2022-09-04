const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    content: String,
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post"
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

commentSchema.statics.findPostComments = async function(postId) {
    return await this.find({
        post: { $in: postId }
    }).populate('author');
};

commentSchema.statics.deletePostComments = async function(postId) {
    await this.deleteMany({
        post: { $in: postId}
    });
};

module.exports = mongoose.model('Comment', commentSchema);