const express = require('express');
const bodyParser = require('body-parser');
const { readAFile, writeAFile, generateRandomString } = require('./services');
const {
  validateEmail,
  validatePassword,
  authenticationToken,
  validateName,
  validateAge,
  validateTalkWatchedAt,
  validateTalkRate,
} = require('./middlewares');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const data = await readAFile('talker.json');

  if (data) {
    return res.status(200).json(data);
  }
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readAFile('talker.json');
  const getTalker = data.find((talker) => talker.id === +id);

  if (getTalker) {
    return res.status(200).json(getTalker);
  }

  res.status(404).json({
    message: 'Pessoa palestrante não encontrada',
  });
});

app.post('/login', validateEmail, validatePassword, (_req, res) => {
  const token = generateRandomString(16);

  return res.status(200).json({ token });
});

app.use(authenticationToken);

app.post(
  '/talker',
  validateName,
  validateAge,
  validateTalkWatchedAt,
  validateTalkRate,
  async (req, res) => {
    const { name, age, talk } = req.body;
    const data = await readAFile('talker.json');

    const newData = {
      name,
      age,
      id: data.length + 1,
      talk,
    };

    data.push(newData);

    await writeAFile('talker.json', data);

    return res.status(201).json(newData);
  },
);

app.listen(PORT, () => {
  console.log('Online');
});
