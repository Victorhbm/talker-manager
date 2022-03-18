const express = require('express');
const bodyParser = require('body-parser');
const {
  validateEmail,
  validatePassword,
  authenticationToken,
  validateName,
  validateAge,
  validateTalkWatchedAt,
  validateTalkRate,
} = require('./middlewares');
const {
  getTalkers,
  getTalkersBySearch,
  getTalkerById,
  generateToken,
  addTalker,
  changeTalkerInfo,
  deleteTalker,
} = require('./controllers');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', getTalkers);

app.get('/talker/search', authenticationToken, getTalkersBySearch);

app.get('/talker/:id', getTalkerById);

app.post('/login', validateEmail, validatePassword, generateToken);

app.use(authenticationToken);

app.post(
  '/talker',
  validateName,
  validateAge,
  validateTalkWatchedAt,
  validateTalkRate,
  addTalker,
);

app.put(
  '/talker/:id',
  validateName,
  validateAge,
  validateTalkWatchedAt,
  validateTalkRate,
  changeTalkerInfo,
);

app.delete('/talker/:id', deleteTalker);

app.listen(PORT, () => {
  console.log('Online');
});
