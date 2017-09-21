import express from 'express';
const router = express.Router();

import { catchAsync } from '~/services/catchAsync';
import * as User from './model';

router.get('/', catchAsync(async (request, response) => {
  const res = await User.select.all();
  response.status(200).json(res);
}));

router.delete('/:id', catchAsync(async (request, response) => {
  await User.destroy(request.params.id);
  response.status(200).json({});
}));

export { router };
