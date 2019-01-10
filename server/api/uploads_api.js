require('dotenv').config();

const fs = require('fs');
const express = require('express');
const router = express.Router();

const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const dbCourseFile = require('../db/course_file');

const CourseFile = new dbCourseFile();


router.post('/delete', async (req, res, next) => {
  const { body } = req;
  const { id, token } = body;

  await CourseFile.delete({
    fileName: id
  });

  res.json({
    code: 200,
    message: 'Done',
  })
});

router.get('/:filename', (req, res) => {
  const { filename } = req.params;

  if (filename.indexOf('/') > -1) {
    res.json({
      code: 500,
      message: 'Invalid filename',
    });
    return;
  }

  const fileDir = `${__basedir}/uploads/${filename}`;
  const exist = fs.existsSync(fileDir);
  if (exist) res.download(fileDir);
  else {
    res.json({
      code: 404,
      message: 'Not found',
    });
  }
});

router.post('/:courseId/:assignmentId/:userId/:fileTopic/file', upload.single('data'), async (req, res, next) => {
  const { originalname: fileOriginalName, filename: fileName } = req.file;

  const { courseId, assignmentId, userId, fileTopic } = req.params;

  await CourseFile.insert({
    userId,
    courseId,
    fileName,
    fileTopic,
    assignmentId,
    fileOriginalName,
  });

  res.json({
    code: 200,
    message: 'Done',
  })
});

module.exports = router;
