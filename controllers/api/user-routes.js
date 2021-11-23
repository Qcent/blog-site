const router = require('express').Router();
const sequelize = require('../../config/connection');
const { User, Post, Vote, Comment } = require('../../models');

const withAuth = require('../../utils/auth');

// GET /api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method)
    User.findAll({
            attributes: { exclude: ['password'] }
        })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
            attributes: { exclude: ['password'] },
            where: {
                id: req.params.id
            },
            include: [{
                    model: Post,
                    attributes: ['id', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM comment WHERE posts.id = comment.post_id )'), 'comment_count'], ]
                },
                // include the Comment model here:
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
            ]
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/users
router.post('/', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        .then(dbUserData => {
            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                req.session.loggedIn = true;

                res.json(dbUserData);
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/users/logout
router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    } else {
        res.status(404).end();
    }
});

// POST /api/users/login
router.post('/login', (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' });
            return;
        }
        // Verify user
        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }

        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'You are now logged in!' });
        });
    });

})

// PUT /api/users/1
router.put('/:id', withAuth, (req, res) => {
    if (req.session.user_id == req.params.id) {
        if (req.body.password) {
            User.update({
                    username: req.body.username,
                    email: req.body.email,
                    user_bio: req.body.user_bio,
                    password: req.body.password
                }, {
                    where: {
                        id: req.params.id
                    }
                })
                .then(dbUserData => {
                    if (!dbUserData[0]) {
                        res.status(404).json({ message: 'No user found with this id' });
                        return;
                    }
                    console.log(req.body)
                    req.session.save(() => {
                        req.session.username = req.body.username;

                        res.json(dbUserData);
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json(err);
                });
        } else {
            User.update({
                    username: req.body.username,
                    email: req.body.email,
                    user_bio: req.body.user_bio
                }, {
                    where: {
                        id: req.params.id
                    }
                })
                .then(dbUserData => {
                    if (!dbUserData[0]) {
                        res.status(404).json({ message: 'No user found with this id' });
                        return;
                    }
                    console.log(req.body)
                    req.session.save(() => {
                        req.session.username = req.body.username;

                        res.json(dbUserData);
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json(err);
                });
        }
    } else {
        const err = `Unauthorized Edit`;
        console.log(err);
        res.status(500).json(err);
    }
});

// DELETE /api/users/1
router.delete('/:id', withAuth, (req, res) => {
    User.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;