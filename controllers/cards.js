const NotFoundError = require('../middlewares/errors/NotFoundError');
const BadRequestError = require('../middlewares/errors/BadRequestError');
const Card = require('../models/card');
const ForbiddenError = require('../middlewares/errors/ForbiddenError');

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
        next(new BadRequestError('Переданы некорректные данные при создании карточки'));
      } else {
        next(error);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('Карточка с указанным id не найдена'));
      }
      if (card.owner.toString() !== req.user._id) {
        return next(new ForbiddenError('Доступ запрещен'));
      }
      return Card.deleteOne(card)
        .then(() => res.status(200).send({ message: 'Карточка успешно удалена' }));
    })
    .catch((error) => {
      if (error.name === 'CustomError') {
        next(new NotFoundError('Пользователь по указанному id не найден'));
      } else {
        next(error);
      }
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
        next(new NotFoundError('Карточка с указанным id не найдена'));
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequestError('Пользователь по указанному id не найден'));
      }
      return next(error);
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
        next(new NotFoundError('Карточка с указанным id не найдена'));
      }
    })
    .catch((error) => {
      if (error.name === 'CastError') {
        return next(new BadRequestError('Пользователь по указанному id не найден'));
      }
      return next(error);
    });
};
