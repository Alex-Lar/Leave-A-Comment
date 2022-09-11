const Comment = require('../models/comment.schema');

module.exports.renderEdit = async (req, res, next) => {
    const { id } = req.params;
    const comment = await Comment.findById(id);
    res.render('posts/edit', {
        comment,
        isPost: false
    });
};

module.exports.editComment = async (req, res, next) => {
    const { id } = req.params;
    const { content } = req.body;
    const comment = await Comment.findByIdAndUpdate(id, { content }).populate('post', '_id');
    
    req.flash('success', 'Comment was successfully edited!');
    res.redirect(`/posts/${comment.post._id}`);
};

module.exports.deleteComment = async (req, res, next) => {
    const { id } = req.params;
    const delComment = await Comment.findByIdAndDelete(id).populate('post', '_id');

    req.flash('success', 'Comment successfully deleted!');
    res.redirect(`/posts/${delComment.post._id}`);
};