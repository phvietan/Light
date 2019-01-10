require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Different api end points
const newsApi = require('./api/news_api');
const usersApi = require('./api/users_api');
const coursesApi = require('./api/courses_api');
const uploadsApi = require('./api/uploads_api');
const reportsApi = require('./api/reports_api');

global.__basedir = __dirname+'/..';

async function openBackEndServer() {
  const { BACK_END_PORT: port } = process.env;

  const app = express();

  // Stating Server
  app.listen(
    port,
    () => {
      console.log(`Backend Server started on port ${port}`);
    }
  );

  // Setup middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }))

  // Routing apis
  const routeUploads = process.env.API_UPLOADS;
  const routeApiNews = process.env.API_NEWS;
  const routeApiUsers = process.env.API_USERS;
  const routeApiCourses = process.env.API_COURSES;
  const routeApiReports = process.env.API_REPORTS;

  app.use(routeUploads, uploadsApi);
  app.use(routeApiNews, newsApi);
  app.use(routeApiUsers, usersApi);
  app.use(routeApiCourses, coursesApi);
  app.use(routeApiReports, reportsApi);

  // Error handler
  app.use(function (err, req, res, next) {
    console.log(err.message);
    res.status(err.code).send(err);
  });
}

async function openDatabase() {
  const { VAGRANT_DB_URL: url } = process.env;
  mongoose.connect(url, { useNewUrlParser: true });

  const db = mongoose.connection;
  db.once('open', () => {
    console.log(`Mongo connected on mongodb://${process.env.VAGRANT_IP}:27017/light`);
  });
}

async function loadServer() {
  // To ensure database is open first
  await openDatabase();

  // Then the api server
  await openBackEndServer();
}

loadServer();
