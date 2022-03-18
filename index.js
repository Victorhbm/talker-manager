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

const TALKER_FILENAME = 'talker.json';

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const data = await readAFile(TALKER_FILENAME);

  if (data) {
    return res.status(200).json(data);
  }
});

app.get('/talker/search', authenticationToken, async (req, res) => {
  const { q } = req.query;
  const data = await readAFile(TALKER_FILENAME);

  if (!q || q === '') {
    return res.status(200).json(data);
  }

  const filterTalkers = data.filter((talker) => talker.name.includes(q));

  if (filterTalkers.length === 0) {
    return res.status(200).json([]);
  }

  return res.status(200).json(filterTalkers);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readAFile(TALKER_FILENAME);
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
    const data = await readAFile(TALKER_FILENAME);

    const newData = {
      name,
      age,
      id: data.length + 1,
      talk,
    };

    data.push(newData);

    await writeAFile(TALKER_FILENAME, data);

    return res.status(201).json(newData);
  },
);

app.put(
  '/talker/:id',
  validateName,
  validateAge,
  validateTalkWatchedAt,
  validateTalkRate,
  async (req, res) => {
    const { name, age, talk } = req.body;
    const { id } = req.params;
    const data = await readAFile(TALKER_FILENAME);
    const getTalkerIndex = data.findIndex((talker) => talker.id === +id);

    const newData = {
      name,
      age,
      id: +id,
      talk,
    };

    data[getTalkerIndex] = newData;

    await writeAFile(TALKER_FILENAME, data);

    return res.status(200).json(newData);
  },
);

app.delete('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readAFile(TALKER_FILENAME);
  const newData = data.filter((talker) => talker.id !== +id);

  await writeAFile(TALKER_FILENAME, newData);
  return res.status(204).send();
});

app.listen(PORT, () => {
  console.log('Online');
});
