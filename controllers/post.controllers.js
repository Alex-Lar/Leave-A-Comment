const Post = require('../models/post.schema');
const Comment = require('../models/comment.schema');

module.exports.index = async (req, res, next) => {
    const posts = await Post.find({}).populate('author', 'username');
    res.render('posts/posts', {
        posts
    });
};

module.exports.renderCreatePage = (req, res, next) => {
    res.render('posts/create');
};

module.exports.renderShowPage = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id).populate('author', 'username');

    const comments = await Comment.findPostComments(post._id);

    res.render('posts/show', {
        post,
        comments
    });
};

module.exports.renderEditPage = async (req, res, next) => {
    const { id } = req.params;
    const post = await Post.findById(id);

    res.render('posts/edit', {
        post,
        isPost: true
    });
};

module.exports.createPost = async (req, res, next) => {
    const { title, content } = req.body;

    if (!title || !content) {
        req.flash('error', 'Both input fields must be filled in!')
        return res.redirect('/posts/create');
    }

    const post = new Post({title, content});
    post.author = req.user._id;
    await post.save();

    req.flash('success', 'New post successfully created!');
    res.redirect('/posts');
};

module.exports.editPost = async (req, res, next) => {
    const { id } = req.params;
    await Post.findByIdAndUpdate(id, { ...req.body });
    req.flash('success', 'The post was successfully edited!');
    res.redirect(`/posts/${id}`);
};


module.exports.createComment = async (req, res, next) => {
    const { id } = req.params;
    const { content } = req.body;

    const post = await Post.findById(id);
    const newComment = new Comment({content});

    newComment.post = post._id;
    newComment.author = req.user._id;

    await post.save();
    await newComment.save();

    req.flash('success', 'Comment has been successfully published');
    res.redirect(`/posts/${id}`);
};

module.exports.deletePost = async (req, res, next) => {
    const { id } = req.params;
    await Comment.deletePostComments(id);
    await Post.findByIdAndDelete(id);
    
    req.flash('success', 'Post successfully deleted!');
    res.redirect('/posts');
};