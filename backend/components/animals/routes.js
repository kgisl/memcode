import express from 'express';
const router = express.Router();

import { catchAsync } from '~/services/catchAsync';
import * as Animal from './model';

router.get('/', catchAsync(async (request, response) => {
  const res = await Animal.select.all();
  response.status(200).json(res);
}));

router.post('/', catchAsync(async (request, response) => {
  const animal = await Animal.insert.create(request.body['animal']);
  response.status(200).json(animal);
}));

export { router };
