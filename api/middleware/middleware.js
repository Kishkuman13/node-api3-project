const User = require('../users/users-model');

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
};

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  const { id } = req.params;
  try {
    const user = await User.getById(id)
    if (user) {
      req.body = user;
      next();
    } else {
      next({ ...Error(), status: 404, message: 'user not found' });
    }
  } catch(err) {
    next({ ...Error(), status: 500, message: 'Error validating user id' });
  }
};

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  if (req.body && Object.keys(req.body).length > 0) {
    next();
  } else if (!req.body.name || req.body.name === null || req.body.name === '') {
    next({ ...Error(), status: 400, message: 'missing required name field' });
  } else {
    next({ ...Error(), status: 400, message: 'missing user data' });
  }
};

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  if (req.body && Object.keys(req.body).length > 0) {
    next();
  } else if (!req.body.text) {
    next({ ...Error(), status: 400, message: 'missing required text field' });
  } else {
    next({ ...Error(), status: 400, message: 'missing user data' });
  }
};

// do not forget to expose these functions to other modules

module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
}
