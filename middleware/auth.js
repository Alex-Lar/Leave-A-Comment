const Post = require('../models/post.schema');
const Comment = require('../models/comment.schema');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.user) {
        req.flash('warning', 'Before using the service you need to log in');
        return res.redirect('/login')
    }
    next();
};

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate('author', '_id');
    if (!post.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/posts/${id}`);
    }
    next();
};

module.exports.isCommentAuthor = async(req, res, next) => {
    const { id } = req.params;
    const comment = await Comment.findById(id)
    .populate('author', '_id')
    .populate('post', '_id');

    if (!comment.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!')
        return res.redirect(`/posts/${comment.post._id}`);
    }

    next();
};
