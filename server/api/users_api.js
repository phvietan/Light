require('dotenv').config();

var fs = require('fs');
const parse = require('csv-parse');
const express = require('express');
const router = express.Router();
const Promise = require('bluebird');

const { isContainUndefined } = require('./helper.js');
const multer = require('multer');

// Test Model
const dbUsers = require('../db/users');
const dbUserSession = require('../db/user_session');

const upload = multer({ dest: 'uploads/' });

const { MISSING_PARAM_CODE } = process.env;
const { MISSING_PARAM_MESSAGE } = process.env;

const { INTERNAL_ERROR_CODE } = process.env;
const { SERVER_CANNOT_RESPONSE } = process.env;

const Users = new dbUsers();
const userSession = new dbUserSession();

async function getUserFromToken(token) {
  const session = await userSession.findOne({ _id: token });
  return Users.findOne({ userId: session.userId });
}

router.get('/multiple_info', async (req, res, next) => {
  const { query } = req;
  const { array } = query;

  const result = [];

  await Promise.each(array || [], async (id) => {
    const user = await Users.findOne({ _id: id });
    result.push(user.userId);
  });

  res.json({
    data: result,
  });
});

router.post('/delete', async (req, res, next) => {
  const { body } = req;
  let { id, token } = body;

  let user;
  try {
    user = await getUserFromToken(token);
    if (user.type !== 'admin' && user.type !== 'staff') {
      next({
        code: INTERNAL_ERROR_CODE,
        message: 'No permission',
      });
      return;
    }
  } catch (err) {
    next({
      code: INTERNAL_ERROR_CODE,
      message: err.message,
    });
    return;
  }

  await Users.delete({ _id: id });
  return res.json({
    code: 200,
    message: 'Done',
  });
});

router.patch('/update', async (req, res, next) => {
  const { body } = req;
  let { id, type, classId, password, userId, name, email, token } = body;

  let user;
  try {
    user = await getUserFromToken(token);
    if (user.type !== 'admin' && user.type !== 'staff') {
      next({
        code: INTERNAL_ERROR_CODE,
        message: 'No permission',
      });
      return;
    }
  } catch (err) {
    next({
      code: INTERNAL_ERROR_CODE,
      message: err.message,
    });
    return;
  }

  if (type === 'student' && classId==='') {
    next({
      code: INTERNAL_ERROR_CODE,
      message: 'Student must have class',
    });
    return;
  }
  if (type !== 'student') classId = '';

  let updateUser = {
    type,
    name,
    email,
    userId,
    class: classId,
  };
  if (Boolean(password)) {
    password = Users.generateHash(password);
    updateUser = {
      ...updateUser,
      password,
    };
  }

  try {
    const temp = await Users.updateById(id, updateUser);
    res.json({
      code: 200,
      message: 'Done',
    });
  } catch (err) {
    res.json({
      code: 500,
      message: err.message,
    });
    next({
      code: INTERNAL_ERROR_CODE,
      message: err.message,
    });
  }
});

router.post('/upload', upload.single('data'), async function(req, res, next) {
  let csvData=[];
  fs.createReadStream(req.file.path)
      .pipe(parse({delimiter: ','}))
      .on('data', function(csvrow) {
          csvData.push(csvrow);
      })
      .on('end',async function() {
        const people = [];
        const fields = csvData[0];

        // const isFieldInsideArray = (fieldName, array) => {
        //   return array.indexOf(fieldName);
        // };

        const rightFormat = ['name', '']
        const isRightFormat = fields.indexOf((field))

        csvData.slice(1, csvData.length).forEach((value) => {
          const data = {};
          fields.forEach((field, index) => data[field] = value[index]);
          people.push(data);
        });
        const peopleWithPassword = people.map(person => {
          const data = {
            ...person,
            password: Users.generateHash('1'),
          };
          return data;
        });
        try {
          const result = await Users.insertMany(peopleWithPassword);
          return res.json(result);
        } catch (err) {
          next({
            code: INTERNAL_ERROR_CODE,
            message: err.message,
          });
        }
      });
});

router.get('/teachers', async (req, res, next) => {
  const result = await Users.findAll();

  const filterTeacher = user => user.type === 'teacher';
  const removePassword = user => {
    let tempUser = user;
    tempUser.password = null;
    return tempUser;
  };

  const teachers = result.filter(filterTeacher);
  const teachersWithoutPassword = teachers.map(removePassword);

  return res.json(teachersWithoutPassword);
});

router.get('/all_users', async (req, res, next) => {
  const { query } = req;
  const { token } = query;

  try {
    const user = await getUserFromToken(token);
  } catch (err) {
    next({
      code: INTERNAL_ERROR_CODE,
      message: "Cannot get info",
    });
  }

  const users = (await Users.findAll()).filter(user => user.type !== 'admin');
  res.json({
    users,
  });
});

router.get('/info', async (req, res, next) => {
  const { query } = req;
  const { token } = query;

  try {
    const user = await getUserFromToken(token);
    user.password = null;
    return res.json(user);
  } catch (err) {
    next({
      code: INTERNAL_ERROR_CODE,
      message: "Cannot get info",
    });
  }
});

router.get('/user_info', async (req, res, next) => {
  const { query } = req;
  const { id, userId, token } = query;

  try {
    const user = await getUserFromToken(token);
  } catch (err) {
    next({
      code: INTERNAL_ERROR_CODE,
      message: "Cannot get info",
    });
  }

  try {
    if (id) {
      const info = await Users.findOne({ _id: id });
      res.json({
        name: info.name,
        type: info.type,
        class: info.class,
        email: info.email,
        userId: info.userId,
      });
    } else {
      const info = await Users.findOne({ userId });
      res.json({
        name: info.name,
        type: info.type,
        class: info.class,
        email: info.email,
        userId: info.userId,
      });
    }
  } catch (err) {
    next({
      code: INTERNAL_ERROR_CODE,
      message: err.message,
    });
  }

});

router.post('/adduser', async (req, res, next) => {
  const { body } = req;
  const { people, token } = body;

  let user;
  try {
    user = await getUserFromToken(token);
    if (user.type !== 'admin' && user.type !== 'staff') {
      next({
        code: INTERNAL_ERROR_CODE,
        message: 'No permission',
      });
      return;
    }
  } catch (err) {
    next({
      code: INTERNAL_ERROR_CODE,
      message: err.message,
    });
    return;
  }

  const peopleWithPassword = people.map(person => {
    const data = {
      ...person,
      userId: person.id,
      password: Users.generateHash('1'),
    };
    return (user.type === 'staff' && data.type === 'staff') ? null : data;
  }).filter(val => Boolean(val));

  try {
    const result = await Users.insertMany(peopleWithPassword);
    return res.json(result);
  } catch (err) {
    next({
      code: INTERNAL_ERROR_CODE,
      message: err.message,
    });
  }
});

// Register
router.post('/signup', async (req, res, next) => {
  const { body } = req;
  const { type, name, email, password, userId } = body;

  // Request validation
  if (isContainUndefined([type, name, email, password, userId])) {
    next({
      code: MISSING_PARAM_CODE,
      message: MISSING_PARAM_MESSAGE,
    });
    return;
  }

  const newUser = {
    type,
    name,
    userId,
    email: email.toLowerCase(),
    password: Users.generateHash(password),
  };

  try {
    const result = await Users.insert(newUser);
    return res.json(result);
  } catch (err) {
    return res.json({
      error_code: 409,
      body: {
        message: 'User exists',
      }
    });
  }
});

router.post('/logout', async (req, res, next) => {
  const { body } = req;
  const { token } = body;
  try {
    const result = await userSession.remove(token);
    return res.json({ valid: Boolean(result) });
  } catch (err) {
    return res.json({ valid: false });
  }
});

// Sign in
router.post('/signin', async (req, res, next) => {
  const { body } = req;
  const { email, password } = body;

  // Request validation
  if (isContainUndefined([email, password])) {
    return res.json({
      error_code: 400,
      body: {
        message: 'Bad request',
      }
    });
  }
  const user = await Users.findOne({ email });
  if (!user) {
    return res.json({
      error_code: 404,
      body: {
        message: 'User does not exist'
      }
    });
  }
  if (!user.validPassword(password)) {
    return res.json({
      error_code: 400,
      body: {
        message: 'Wrong Password',
      }
    });
  }
  const result = await userSession.insert({
    userId: user.userId,
  });
  return res.json({
    error_code: 0,
    body: {
      token: result._id,
    }
  });
});

module.exports = router;
