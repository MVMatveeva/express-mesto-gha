const NotFoundError = require('../middlewares/errors/NotFoundError');
const BadRequestError = require('../middlewares/errors/BadRequestError');
const InternalServerError = require('../middlewares/errors/InternalServerError');
const ForbiddenError = require('../middlewares/errors/ForbiddenError');

const Card = require('../models/card');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        next(new InternalServerError('Ошибка на стороне сервера'));
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      }
      if (card.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Доступ запрещен'));
      }
      return Card.findByIdAndDelete(req.params.cardId);
    })
    .catch(() => {
      next(new NotFoundError('Пользователь по указанному id не найден'));
    });
};

module.exports.setLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequestError('Пользователь по указанному id не найден'));
      }
      return next(new InternalServerError('Ошибка на стороне сервера'));
    });
};

module.exports.removeLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.status(200).send(card);
      } else {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequestError('Пользователь по указанному id не найден'));
      }
      return next(new InternalServerError('Ошибка на стороне сервера'));
    });
};
