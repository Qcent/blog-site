const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

const withAuth = require('../utils/auth');

router.get('/', withAuth, (req, res) => {
    Post.findAll({
            where: {
                // use the ID from the session
                user_id: req.session.user_id
            },
            attributes: [
                'id',
                'post_content',
                'title',
                'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id AND NOT vote.positive)'), 'neg_count'],
                [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id AND vote.positive)'), 'pos_count'],
                [sequelize.literal('(SELECT COUNT(*) FROM comment WHERE post.id = comment.post_id )'), 'comment_count'],
            ],
            include: [{
                    model: Comment,
                    attributes: ['id'],
                },
                {
                    model: User,
                    attributes: ['username', 'id']
                }
            ],
        })
        .then(dbPostData => {
            // serialize data before passing to template
            const posts = dbPostData.map(post => post.get({ plain: true }));
            res.render('dashboard', { posts, session: req.session });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });

});

router.get('/edit/:id', withAuth, (req, res) => {
    Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'post_content',
                'title',
                'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id AND NOT vote.positive)'), 'neg_count'],
                [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id AND vote.positive)'), 'pos_count'],
            ],
            include: [{
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username', 'id']
                    }
                },
                {
                    model: User,
                    attributes: ['username', 'id']
                }
            ]
        })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }

            // serialize the data
            const post = dbPostData.get({ plain: true });

            // pass data to template
            res.render('edit-post', { post, session: req.session });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;