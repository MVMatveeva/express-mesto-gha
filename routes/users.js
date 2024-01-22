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

userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().length(24).regex(/^[0-9a-fA-F]{24}$/),
  }),
}), getUserById);

userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateUser);

userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/),
  }),
}), updateAvatar);

module.exports = userRouter;
