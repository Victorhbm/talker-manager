const { readAFile, writeAFile, generateRandomString } = require('../services');

const TALKER_FILENAME = 'talker.json';

async function getTalkers(_req, res) {
  const data = await readAFile(TALKER_FILENAME);

  if (data) {
    return res.status(200).json(data);
  }
}

async function getTalkersBySearch(req, res) {
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
}

async function getTalkerById(req, res) {
  const { id } = req.params;
  const data = await readAFile(TALKER_FILENAME);
  const getTalker = data.find((talker) => talker.id === +id);

  if (getTalker) {
    return res.status(200).json(getTalker);
  }

  res.status(404).json({
    message: 'Pessoa palestrante não encontrada',
  });
}

function generateToken(_req, res) {
  const token = generateRandomString(16);

  return res.status(200).json({ token });
}

async function addTalker(req, res) {
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
}

async function changeTalkerInfo(req, res) {
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
}

async function deleteTalker(req, res) {
  const { id } = req.params;
  const data = await readAFile(TALKER_FILENAME);
  const newData = data.filter((talker) => talker.id !== +id);

  await writeAFile(TALKER_FILENAME, newData);
  return res.status(204).send();
}

module.exports = {
  getTalkers,
  getTalkersBySearch,
  getTalkerById,
  generateToken,
  addTalker,
  changeTalkerInfo,
  deleteTalker,
};