const router = require("express").Router();
const { User } = require("../db/User");
const { publicPosts, privatePosts } = require("../db/Post");
const checkAuth = require("../middleware/checkAuth");

// 誰でも見れる
router.get("/public", (req, res) => {
    res.json(publicPosts);
});

// jwt持ってるひとのみ
router.get(
    "/private",
    checkAuth,
    (req, res) => {
        res.json(privatePosts);
    }
);


module.exports = router;

