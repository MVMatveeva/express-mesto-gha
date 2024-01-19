const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const router = require('./routes');

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(router);

app.listen(PORT, () => {
  console.log('Ссылка на сервер');
});

//"email": "yandexyandex@yandex.ru",
//"password": "457967qq"

//"name": "Tonya",
//"password":"qwerty78l;l;9"
