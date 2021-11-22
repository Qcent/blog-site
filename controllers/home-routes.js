const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// get all posts for homepage
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
            attributes: [
                'id',
                'post_content',
                'title',
                'created_at', 'updated_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id AND NOT vote.positive)'), 'neg_count'],
                [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id AND vote.positive)'), 'pos_count'],
            ],
            include: [{
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
            ],
            limit: 10,
            order: [
                ['updated_at', 'DESC']
            ]
        })
        .then(dbPostData => {
            const posts = dbPostData.map(post => post.get({ plain: true }));

            res.render('homepage', {
                posts,
                session: req.session
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//get specific post by id
router.get('/post/:id', (req, res) => {
    Post.findOne({
            where: {
                id: req.params.id
            },
            attributes: [
                'id',
                'post_content',
                'title',
                'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id AND NOT vote.positive)'), 'neg_count'],
                [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id AND vote.positive )'), 'pos_count'],
            ],
            include: [{
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
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }

            // serialize the data
            const post = dbPostData.get({ plain: true });

            //specify single post to prevent link generation
            post.view = 1;
            // pass data to template
            res.render('single-post', { post, session: req.session });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/login', (req, res) => {
    console.log(req.session);
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
});

/* for returning the posts with diferent sorts */
router.get('/:sort', (req, res) => {
    let sortby = '';
    let direction = 'DESC';

    switch (req.params.sort) {
        case '1':
            sortby = 'updated_at'
            break;
        case '2':
            sortby = 'updated_at'
            direction = 'ASC';
            break;
        case '3':
            sortby = sequelize.literal('pos_count');
            break;
        case '4':
            sortby = sequelize.literal('neg_count');
            break;
            /*      
                        case '5':
                        sortby = sequelize.col('comment_count');
                        break;
            */
        default:
            sortby = 'updated_at'
            break;
    }
    Post.findAll({
            attributes: [
                'id',
                'post_content',
                'title',
                'created_at', 'updated_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id AND NOT vote.positive)'), 'neg_count'],
                [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id AND vote.positive)'), 'pos_count'],
            ],
            include: [{
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM comment WHERE post.id = comment.post_id )'), 'comment_count']],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
                {
                    model: User,
                    attributes: ['username']
                }
            ],
            limit: 15,
            order: [
                [sortby, direction]
            ]
        })
        .then(dbPostData => {
            const posts = dbPostData.map(post => post.get({ plain: true }));

            res.render('homepage', {
                posts,
                session: req.session
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;