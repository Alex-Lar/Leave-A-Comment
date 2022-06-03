function filter(allComms, post) {
    return allComms.filter((cur) => {
        const userId = cur.user.toString();
        if (userId === post.id) {
            return cur;
        }
    });
}

module.exports = filter;