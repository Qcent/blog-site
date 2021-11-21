const sequelize = require('../../config/connection');
const router = require('express').Router();

const { Post, User, Vote, Comment } = require('../../models');

const withAuth = require('../../utils/auth');

// get all posts
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
            // Query configuration
            attributes: ['id', 'post_content', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
            order: [
                ['created_at', 'DESC']
            ],
            include: [
                // include the Comment model here:
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//get one post
router.get('/:id', (req, res) => {
    Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: ['id', 'post_content', 'title', 'created_at', [sequelize.literal(`
            (SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id AND post.positive = 1)`), 'pos_count']],
            include: [
                // include the Comment model here:
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                }, {
                    model: User,
                    attributes: ['username']
                }
            ]
        })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//post a new post
router.post('/', withAuth, (req, res) => {
    Post.create({
            title: req.body.title,
            post_content: req.body.post_content,
            user_id: req.session.user_id
        })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});

// PUT /api/posts/upvote
router.put('/upvote', withAuth, (req, res) => {
    // make sure the session exists first
    if (req.session) {
        // pass session id along with all destructured properties on req.body
        Post.upvote({...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
            .then(updatedVoteData => res.json(updatedVoteData))
            /*
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
            */
            .catch(err => {
                console.log(req.body);
                Vote.update({
                        positive: req.body.positive
                    }, {
                        where: {
                            post_id: req.body.post_id,
                            user_id: req.session.user_id
                        }
                    })
                    .then(dbPostData => {
                        if (!dbPostData) {
                            res.status(404).json({ message: 'No post found with this id' });
                            return;
                        }
                        res.json(dbPostData);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json(err);
                    });
            });
    }
});


// update a post title
router.put('/:id', withAuth, (req, res) => {
    Post.update({
            title: req.body.title,
            post_content: req.body.post_content
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//delete a route
router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;