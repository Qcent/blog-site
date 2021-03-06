const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment, Vote } = require('../models');
const withAuth = require('../utils/auth');


//get specific user by id
router.get('/:id', (req, res) => {
    User.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'username',
                'user_bio',
                'email',
                'created_at'
            ],
            include: [{
                    model: Post,
                    attributes: ['id', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE posts.id = vote.post_id AND NOT vote.positive)'), 'neg_count'],
                        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE posts.id = vote.post_id AND vote.positive)'), 'pos_count'],
                    ],
                    include: [{
                        model: User,
                        attributes: ['id', 'username'],
                    }, {
                        model: Comment,
                        attributes: ['id'],
                    }]
                },
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'created_at'],
                    include: {
                        model: Post,
                        attributes: ['title', 'id']
                    }
                },
                {
                    model: Post,
                    attributes: ['title', 'id'],
                    through: Vote,
                    as: 'voted_posts'
                }
            ],
            order: [
                [Post, 'created_at', 'DESC']
            ]
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            // serialize the data
            const user = dbUserData.get({ plain: true });

            // pass data to template
            res.render('single-user', { user, session: req.session });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;