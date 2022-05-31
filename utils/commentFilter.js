module.exports.getComments = async (post, allComments) => {
    let filteredComments = allComments.filter((cur) => {
        const userId = cur.user.toString();

        if (userId === post.id) {
            return cur;
        }
    });
    
    return filteredComments;
};
