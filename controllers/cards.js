const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((data) => res.send(data))
    .catch(() => res.status(500).send({ message: 'Ошибка на стороне сервера' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(200).send(card))
    .catch((error) => {
      if (error.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(500).send({ message: 'Ошибка на стороне сервера' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId).then((card) => {
    if (card) {
      res.status(200).send({ message: 'Карточка удалена' });
    } else {
      res.status(404).send({ message: 'Карточка с указанным id не найдена' });
    }
  })
    .catch(() => {
      res.status(500).send({ message: 'Ошибка на стороне сервера' });
    });
};

module.exports.setLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      }
      return res.status(200).send({ data: card });
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

module.exports.removeLikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка с указанным id не найдена' });
      } else {
        res.status(200).send({ data: card });
      }
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
