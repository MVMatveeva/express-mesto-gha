const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../middlewares/errors/NotFoundError');
const BadRequestError = require('../middlewares/errors/BadRequestError');
const ConflictError = require('../middlewares/errors/ConflictError');
const UnauthorizedError = require('../middlewares/errors/UnauthorizedError');
const InternalServerError = require('../middlewares/errors/InternalServerError');

const AUTH_ERROR = 11000;

module.exports.getUsers = (req, res, next) => {
  User.find()
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному id не найден.'));
        return;
      }
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequestError('Пользователь по указанному id не найден'));
      }
      return next(new InternalServerError('Ошибка на стороне сервера'));
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      email: user.email,
      avatar: user.avatar,
    }))
    .catch((error) => {
      if (error.code === AUTH_ERROR) {
        next(new ConflictError({
          'message': 'Пользователь с данным email уже существует'
          }));
      } else if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(new InternalServerError('Ошибка на стороне сервера'));
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { runValidators: true, new: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь с указанным id не найден'));
        return;
      }
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      } else {
        next(new InternalServerError('Ошибка на стороне сервера'));
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { runValidators: true, new: true },
  )
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь с указанным id не найден'));
        return;
      }
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при обновлении аватара'));
      } else {
        next(new InternalServerError('Ошибка на стороне сервера'));
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'super-secret-key', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Отказ в доступе'));
    });
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь по указанному id не найден.'));
        return;
      }
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        next(new BadRequestError('Некорректный id пользователя.'));
      } else {
        next(new InternalServerError('Ошибка на стороне сервера'));
      }
    });
};
