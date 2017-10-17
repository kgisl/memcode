import { db } from '~/db/init.js';

const insert = {
  create: (animal) =>
    db.one(
      'INSERT INTO animal (name, age, color) \
      VALUES (${name}, ${age}, ${color}) RETURNING *', animal
    )
};

export { insert };
