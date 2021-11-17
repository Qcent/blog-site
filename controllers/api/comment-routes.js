const router = require('express').Router();
const { Comment, User } = require('../../models');

const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
    Comment.findAll({
            // Query configuration
            attributes: ['id', 'user_id', 'post_id', 'comment_text', 'created_at'],
            order: [
                ['created_at', 'DESC']
            ],
            include: [{
                model: User,
                attributes: ['username']
            }]
        })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/', withAuth, (req, res) => {
    // check the session
    if (req.session) {
        Comment.create({
                comment_text: req.body.comment_text,
                post_id: req.body.post_id,
                // use the id from the session
                user_id: req.session.user_id
            })
            .then(dbCommentData => res.json(dbCommentData))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    }
});

router.delete('/:id', withAuth, (req, res) => {
    Comment.destroy({
            where: {
                id: req.params.id
            }
        }).then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

module.exports = router;