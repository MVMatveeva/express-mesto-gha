const cardRouter = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  setLikeCard,
  removeLikeCard,
} = require('../controllers/cards');

cardRouter.get('/', getCards);

cardRouter.post('/', createCard);

cardRouter.delete('/:cardId', deleteCard);

cardRouter.put('/:cardId/likes', setLikeCard);

cardRouter.delete('/:cardId/likes', removeLikeCard);

module.exports = cardRouter;
