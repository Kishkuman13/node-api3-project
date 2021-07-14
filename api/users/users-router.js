const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const Posts = require('../posts/posts-model');
const Users = require('../users/users-model');

const {
  validateUserId,
  validateUser,
  validatePost,
} = require('../middleware/middleware');

const router = express.Router();

router.get('/', (req, res) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  Users.get()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.log(err)
      res.status(500).json({ message: 'Error fetching users'});
    });
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  // this needs a middleware to verify user id
  try {
    const user = req.body;
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user'});
  }
});

router.post('/', validateUser, async (req, res) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  // this needs a middleware to check that the request body is valid
  const user = req.body;

  try {
    const newUser = await Users.insert(user);
    res.status(201).json(newUser);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error creating new user' });
  }
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const { id } = req.params;
  const user = req.body;
  
  try {
    const updatedUser = await Users.update(id, user);
    if (updatedUser) {
      res.status(200).json(updatedUser);
    } else if (!updatedUser.name) {
      res.status(400).json({ message: 'User name required' });
    } else {
      res.status(404).json({ message: 'User id does not exist' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'User can not be modified' });
  }
});

router.delete('/:id', validateUserId, async (req, res) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  // this needs a middleware to verify user id
  const { id } = req.params;

  try {
    const user = await Users.remove(id);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'User does not exist' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'User could not be deleted' });
  }
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  const { id } = req.params;
  Users.getUserPosts(id)
    .then((posts) => {
      if (posts) {
        res.status(200).json(posts);
      } else if (!posts) {
        res.status(404).json({ message: 'Unable to find user post data' });
      } else {
        res.status(404).json({ message: 'Unable to find user post data' });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'An error occured while fetching posts' });
    });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
  const newPost = {...req.body, user_id: req.params.id };
  Posts.insert(newPost)
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: 'An error occured while posting' });
    });
});

// do not forget to export the router

module.exports = router;
