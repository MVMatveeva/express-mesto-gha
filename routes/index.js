const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const app = require('../app');

router.use('/users', userRouter);

router.use('/cards', cardRouter);

app.use((req, res) => {
  res.status(404).send({ message: 'Страница не найдена' });
});

module.exports = router;
