const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find()
    .then((users) => {
      res.send({ data: users });
    })
    .catch(() => res.status(500).send({ message: 'Ошибка на стороне сервера' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь по указанному id не найден.' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return res.status(400).send({
          message: 'Пользователь по указанному id не найден',
        });
      }
      return res.status(500).send({ message: 'Ошибка на стороне сервера' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User
    .create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({
          message: 'Пользователь по указанному id не найден',
        });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User
    .findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с указанным id не найден' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User
    .findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Пользователь с указанным id не найден' });
        return;
      }
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};
