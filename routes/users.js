/* eslint-disable no-useless-escape */
const userRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUserById,
  getUsers,
  updateUser,
  updateAvatar,
  getUser,
} = require('../controllers/users');

userRouter.get('/', getUsers);

userRouter.get('/me', getUser);

userRouter.get('/:userId', getUserById);

//userRouter.get('/:userId', getUser);

//userRouter.get('/me', getUserById);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/),
  }),
}), updateAvatar);

module.exports = userRouter;
