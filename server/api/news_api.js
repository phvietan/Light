require('dotenv').config();

const express = require('express');
const router = express.Router();

const dbNews = require('../db/news');
const dbUsers = require('../db/users');
const dbUserSession = require('../db/user_session');

const News = new dbNews();
const Users = new dbUsers();
const UserSession = new dbUserSession();

const { INTERNAL_ERROR_CODE } = process.env;
const { SERVER_CANNOT_RESPONSE } = process.env;

async function getUserFromToken(token) {
  const session = await UserSession.findOne({ _id: token });
  return Users.findOne({ userId: session.userId });
}

router.post('/delete', async (req, res, next) => {
  const { body } = req;
  const { token, id } = body;
  const { type } = await getUserFromToken(token);
  if (type !== 'admin' && type !== 'staff') {
    next({
      code: INTERNAL_ERROR_CODE,
      message: 'Not have priviledge to do this',
    });
    return;
  }

  await News.delete({ _id: id });
  return res.json({
    code: 200,
    message: 'Done',
  });
});

router.patch('/update', async (req, res, next) => {
  const { body } = req;
  const { id, title, token, content } = body;

  const { type } = await getUserFromToken(token);
  if (type !== 'admin' && type !== 'staff') {
    next({
      code: INTERNAL_ERROR_CODE,
      message: 'Not have priviledge to do this',
    });
    return;
  }

  const updated = await News.updateById(id, {
    title,
    content,
  });
  res.json({
    code: 200,
    message: 'Done',
  });
});

router.get('/from_to_info', async (req, res, next) => {
  const { query } = req;
  const { from, to } = query;
  const result = await News.findAllByDate();
  return res.json({
    n: result.length,
    data: result.slice(from, to),
  });
});

router.get('/next_info', async (req, res, next) => {
  const { query } = req;
  const { id, to } = query;
  const result = await News.findAllByDate();
  const index = result.findIndex(value => value._id.toString() === id) + 1;
  return res.json({
    n: result.length,
    data: result.slice(index, index + Number(to)),
  });
});

router.get('/info', async (req, res, next) => {
  const { query } = req;
  const { id } = query;
  const result = await News.findOne({ _id: id });
  return res.json({
    title: result.title,
    content: result.content,
  });
});

router.post('/create', async (req, res, next) => {
  const { body } = req;
  const { title, token, content } = body;
  const { type } = await getUserFromToken(token);
  if (type !== 'admin' && type !== 'staff') {
    next({
      code: INTERNAL_ERROR_CODE,
      message: 'Not have priviledge to do this',
    });
    return;
  }

  await News.insert({ title, content });
  return res.json({
    code: 200,
    message: 'Done',
  });
});

module.exports = router;
