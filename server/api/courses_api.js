require('dotenv').config();

const express = require('express');
const router = express.Router();

const Promise = require('bluebird');
const dbUsers = require('../db/users');
const dbCourses = require('../db/courses');
const dbCourseFile = require('../db/course_file');
const dbUserCourse = require('../db/user_course');
const dbUserSession = require('../db/user_session');

const { isContainUndefined } = require('./helper.js');

const Users = new dbUsers();
const Courses = new dbCourses();
const CourseFile = new dbCourseFile();
const UserCourse = new dbUserCourse();
const UserSession = new dbUserSession();

const { INTERNAL_ERROR_CODE } = process.env;
const { SERVER_CANNOT_RESPONSE } = process.env;

async function getUserFromToken(token) {
  const session = await UserSession.findOne({ _id: token });
  return Users.findOne({ userId: session.userId });
}

async function enroll(teacherId, courseId) {
  const found = Boolean(await UserCourse.findOne({
    courseId,
    userId: teacherId,
  }));

  if (!found) await UserCourse.insert({
    courseId,
    userId: teacherId,
  });
}

async function de_enroll(teacherId, courseId) {
  const found = Boolean(await UserCourse.findOne({
    userId: teacherId,
    courseId,
  }));

  if (found) await UserCourse.delete({
    courseId,
    userId: teacherId,
  });
}


router.get('/all_info', async (req, res, next) => {
  const result = await Courses.findAll();
  return res.json({
    courses: result,
  });
});

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

  await Courses.delete({ _id: id });
  await UserCourse.delete({ courseId: id });
  return res.json({
    code: 200,
    message: 'Done',
  });
});

router.patch('/update', async (req, res, next) => {
  const { body } = req;
  const { teacherId, name, title, content, token, defaultClass, year, semester, moment, id } = body;

  // Request validation
  if (isContainUndefined([name, title, content, token, year, semester, moment])) {
    next({
      code: MISSING_PARAM_CODE,
      message: MISSING_PARAM_MESSAGE,
    });
    return;
  }

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

  const date = new Date(moment);

  try {
    const course = await Courses.updateById(id, {
      date,
      year,
      name,
      content,
      semester,
      teacherId,
      code: title,
    });

    const courseId = id;
    await enroll(teacherId, courseId);

    if (defaultClass) {
      const users = (await Users.find({
        class: defaultClass,
      })).map(user => user.userId);
      await Promise.each(users, async (userId) => {
        await UserCourse.insert({
          userId,
          courseId,
        });
      });
    }
    res.json({
      status: '200',
      message: 'Successfully',
    });
  } catch (err) {
    console.log(err.message);
    res.json({
      status: '500',
      message: err.message,
    });
  }
});

router.get('/info', async (req, res, next) => {
  const { query } = req;
  const { id } = query;
  const result = await Courses.findOne({ _id: id });
  if (!Boolean(result)) {
    res.json({
      code: 404,
      message: 'Course not found',
    });
    return;
  }
  return res.json({
    date: result.date,
    name: result.name,
    code: result.code,
    year: result.year,
    content: result.content,
    semester: result.semester,
    teacherId: result.teacherId,
  });
});

router.get('/files', async (req, res, next) => {
  const { query } = req;
  const { assignmentId, courseId } = query;

  const files = await CourseFile.find({
    assignmentId,
    courseId,
  });

  res.json({
    files,
    code: 200,
    message: 'Done',
  });
});

router.get('/registered', async (req, res, next) => {
  const { query } = req;
  const { userId } = query;
  const registeredCoursesId = (await UserCourse.find({ userId })).map(userCourse => userCourse.courseId);

  const registeredCourses = await Promise.map(registeredCoursesId, async (courseId) => {
    const summary = await Courses.findOne({ _id: courseId });
    if (!Boolean(summary)) return null;
    return {
      id: courseId,
      code: summary.code,
      year: summary.year,
      semester: summary.semester,
    };
  }, { concurrency: 200 }).filter(course => Boolean(course));

  return res.json({
    registeredCourses,
  });
});

router.get('/summary', async (req, res, next) => {
  const { query } = req;
  const { courseId } = query;
  const summary = await Courses.findOne({ _id: courseId });

  const studentsRegistered = await UserCourse.find({
    courseId,
  });

  return res.json({
    _id: summary._id,
    name: summary.name,
    code: summary.code,
    content: summary.content,
    teacherId: summary.teacherId,
    date: summary.date,
    year: summary.year,
    semester: summary.semester,
    numberOfRegistered: studentsRegistered.length,
  });
});

router.get('/opening', async (req, res, next) => {
  const allCourses = await Courses.findAllByDate();
  if (!allCourses.length) {
    res.json({
      courses: [],
    });
    return;
  };
  const now = Date.now();
  const index = allCourses.findIndex(course => {
    const dateCourse = Date.parse(course.date);
    return dateCourse < now;
  });

  const lastIndex = index === -1 ? allCourses.length : index;
  res.json({
    courses: allCourses.slice(0, lastIndex).map(course => {
      return {
        name: course.name,
        code: course.code,
        teacherId: course.teacherId,
        year: course.year,
        semester: course.semester,
        date: course.date,
        _id: course._id,
      };
    }),
  });
});

router.post('/enrollment', async (req, res, next) => {
  const { body } = req;
  const { courseId, token } = body;

  if (isContainUndefined([token, courseId])) {
    next({
      code: MISSING_PARAM_CODE,
      message: MISSING_PARAM_MESSAGE,
    });
    return;
  }

  let user;
  try {
    user = await getUserFromToken(token);
  } catch (err) {
    next({
      code: INTERNAL_ERROR_CODE,
      message: err.message,
    });
    return;
  }

  const now = Date.now();
  const course = await Courses.findOne({ _id: courseId });
  if (now > course.date) {
    res.json({
      code: 500,
      message: 'Due date exceed, cannot do enrollment anymore',
    });
    return;
  }

  const userCourse = await UserCourse.findOne({
    courseId,
    userId: user.userId,
  });
  if (Boolean(userCourse)) {
    await UserCourse.delete({
      _id: userCourse._id,
    });
  }
  else {
    await UserCourse.insert({
      courseId,
      userId: user.userId,
    });
  }
  res.json({
    code: 200,
    message: 'Done enrollment',
  })
});

router.post('/create', async (req, res, next) => {
  const { body } = req;
  const { teacherId, name, title, content, token, defaultClass, year, semester, moment } = body;

  // Request validation
  if (isContainUndefined([name, title, content, token, year, semester, moment])) {
    next({
      code: MISSING_PARAM_CODE,
      message: MISSING_PARAM_MESSAGE,
    });
    return;
  }

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

  const date = new Date(moment);

  try {
    const course = await Courses.insert({
      date,
      year,
      name,
      content,
      semester,
      teacherId,
      code: title,
    });

    const courseId = course._id.toString();
    await enroll(teacherId, courseId);

    if (defaultClass) {
      const users = (await Users.find({
        class: defaultClass,
      })).map(user => user.userId);
      await Promise.each(users, async (userId) => {
        await UserCourse.insert({
          userId,
          courseId,
        });
      });
    }
    res.json({
      status: '200',
      message: 'Successfully',
    });
  } catch (err) {
    res.json({
      status: '500',
      message: err.message,
    });
  }
});

module.exports = router;
