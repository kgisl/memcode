import 'source-map-support/register';
import express from 'express';

// load environment variables.
import '../env.js';
console.log('node env: ' + process.env.NODE_ENV);

const app = express();

import { allowCrossDomain } from './middlewares/allowCrossDomain';
app.use(allowCrossDomain);

import { stopPropagationForAssets } from './middlewares/stopPropagationForAssets';
app.use(stopPropagationForAssets);

import bodyParser from 'body-parser';
app.use(bodyParser.json({ limit: '50mb' })); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
  limit: '50mb', // otherwise will complain about image upload
  extended: true,
  parameterLimit: 50000
}));

import { staticAssets } from './middlewares/static';
app.use(staticAssets);

// routes
import { router as coursesRouter } from './components/courses/routes';
app.use('/api/courses', coursesRouter);

import { router as problemsRouter } from './components/problems/routes';
app.use('/api/problems', problemsRouter);

import { router as coursesUserIsLearningRouter } from './components/coursesUserIsLearning/routes';
app.use('/api/coursesUserIsLearning', coursesUserIsLearningRouter);

import { router as authRouter } from './components/auth/routes';
app.use('/api/auth', authRouter);

// GET routes that return results for particular frontend page. something like what server-rendering would do.
import { router as pagesRouter } from './components/pages/routes';
app.use('/api/pages', pagesRouter);

import { router as usersRouter } from './components/users/routes';
app.use('/api/users', usersRouter);

import { html } from './html';
app.get('*', (request, response) => response.send(html));

// because express needs to see there are 4 arguments to treat :error as error.
// this middleware should also come last.
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(500).json({ error: error.message });
});

// process.env.PORT lets the port be set by Heroku
const port = process.env.PORT || 3000;

app.listen(port, (err) => {
  err ?
  console.log(`server start error: ${err}`) :
  console.log(`server is listening on port: ${port}`);
});
