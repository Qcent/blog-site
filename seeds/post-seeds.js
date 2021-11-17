const { Post } = require('../models');

const postData = [{
        title: 'rock music',
        post_content: 'Rock Music Rocks!',
        user_id: 1
    },
    {
        title: '10 things i like about stuff',
        post_content: 'stuff is the best!',
        user_id: 2
    },
    {
        title: 'Why we feel sad',
        post_content: 'Who Knows!',
        user_id: 3
    },
    {
        title: 'How to make a Bed',
        post_content: 'laydown and close your eyes!',
        user_id: 4
    },
    {
        title: 'Christmas Wishlist',
        post_content: 'Rock Music !',
        user_id: 5
    },
    {
        title: 'Bowling Tips',
        post_content: 'use the grease for extra spin!',
        user_id: 6
    },
    {
        title: 'Paper Airplane Guide',
        post_content: 'fold and fly !',
        user_id: 1
    },
    {
        title: 'JavaScript beter then Java Bean?',
        post_content: 'Inconcievable!',
        user_id: 5
    },
    {
        title: 'Shoe Tying Tricks',
        post_content: 'Use velcro, ya big dummy!',
        user_id: 3
    },
];

const seedPosts = () => Post.bulkCreate(postData);

module.exports = seedPosts;
Post