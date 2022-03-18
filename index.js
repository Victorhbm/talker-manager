const express = require('express');
const bodyParser = require('body-parser');
const { readAFile } = require('./services');

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

app.listen(PORT, () => {
  console.log('Online');
});
