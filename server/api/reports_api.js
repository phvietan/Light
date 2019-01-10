require('dotenv').config();

const express = require('express');
const router = express.Router();

const dbNews = require('../db/news');
const dbUsers = require('../db/users');
const dbReports = require('../db/reports');
const dbUserSession = require('../db/user_session');

const Users = new dbUsers();
const Reports = new dbReports();
const UserSession = new dbUserSession();

const { INTERNAL_ERROR_CODE } = process.env;
const { SERVER_CANNOT_RESPONSE } = process.env;

async function getUserFromToken(token) {
  const session = await UserSession.findOne({ _id: token });
  return Users.findOne({ userId: session.userId });
}

router.patch('/update', async (req, res, next) => {
  const { body } = req;
  const { token, title, content, id } = body;

  const report = await Reports.findOne({ _id: id });
  const user = await getUserFromToken(token);
  if (user.type !== 'admin' && user.type !== 'staff') {
    if (report.userId !== user._id.toString()) {
      next({
        code: INTERNAL_ERROR_CODE,
        message: 'Not have priviledge to do this',
      });
      return;
    }
  }

  await Reports.updateById(id, {
    title,
    content,
  });

  res.json({
    code: 200,
    message: 'Done',
  });
});

router.post('/comment', async (req, res, next) => {
  const { body } = req;
  const { id, comment, userId } = body;

  const newComment = {
    userId,
    comment,
  };

  const { comment: currentComment } = await Reports.findOne({ _id: id });

  const newCommentArray = [...currentComment, newComment];

  await Reports.updateById(id, {
    comment: newCommentArray,
  });

  return res.json({
    code: 200,
    message: 'Done',
  });
});

router.get('/report_info', async (req, res, next) => {
  const { query } = req;
  const { id } = query;

  const result = await Reports.findOne({ _id: id });
  return res.json({
    reports: result,
  });
});

router.get('/info', async (req, res, next) => {
  const { query } = req;
  const { token } = query;
  const user = await getUserFromToken(token);

  if (user.type === 'admin' || user.type === 'staff') {
    const result = await Reports.find();
    return res.json({
      reports: result,
    });
    return;
  }

  const result = await Reports.find({ userId: user._id });
  return res.json({
    reports: result,
  });
});

router.post('/create', async (req, res, next) => {
  const { body } = req;
  const { token, title, content } = body;
  const user = await getUserFromToken(token);
  if (user.type !== 'teacher' && user.type !== 'student') {
    next({
      code: INTERNAL_ERROR_CODE,
      message: 'Not have priviledge to do this',
    });
    return;
  }

  try {
    await Reports.insert({
      title,
      content,
      userId: user._id,
    });
    res.json({
      code: 200,
      message: 'Done',
    });
  } catch (err) {
    console.log(err.message);
    return res.json({
      code: 500,
      message: err.message,
    });
  }
});

router.post('/delete', async (req, res, next) => {
  const { body } = req;
  const { token, id } = body;

  const report = await Reports.findOne({ _id: id });
  const user = await getUserFromToken(token);
  if (user.type !== 'admin' && user.type !== 'staff') {
    if (report.userId !== user._id.toString()) {
      next({
        code: INTERNAL_ERROR_CODE,
        message: 'Not have priviledge to do this',
      });
      return;
    }
  }

  await Reports.delete({ _id: id });

  res.json({
    code: 200,
    message: 'Done',
  });
});

module.exports = router;
