const express = require('express');
const router = require('express').Router();
let Post = require('../models/post.model');

router.use(express.json());

router.route('/').get((req, res) => {
    Post.find()
        .then(posts => res.json(posts))
        .catch(err => res.status(400).json('Error: ' + err));
});


router.route('/add').post((req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const image = req.body.image;
    const likeCount = req.body.likeCount;
    const comments = req.body.comments;

    const newPost = new Post({
        title,
        content,
        image,
        likeCount,
        comments,
    });
    // const newPost = new Post({post});
    console.log("Reached");

    newPost.save()
    .then(() => res.json('Post added'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req,res) => {
    Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req,res) => {
    Post.findByIdAndDelete(req.params.id)
    .then(() => res.json('Post deleted.'))
    .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/update/:id').post((req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        post.title = req.body.title;
        post.content = req.body.content;
        post.image = req.body.image;
        // post.likeCount = Number(req.body.likeCount);
        post.likeCount = req.body.likeCount;
        post.comments = req.body.comments;
  
        post.save()
          .then(() => res.json('Post updated!'))
          .catch(err => res.status(400).json('Error: ' + err));
      })
      .catch(err => res.status(400).json('Error: ' + err));
  });

module.exports = router;