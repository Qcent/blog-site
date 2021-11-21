const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');


//get specific user by id
router.get('/:id', withAuth, (req, res) => {
    User.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'username',
                'user_bio',
                'email',
                'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE user.id = vote.user_id AND NOT vote.positive)'), 'neg_count'],
                [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE user.id = vote.user_id AND vote.positive )'), 'pos_count'],
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