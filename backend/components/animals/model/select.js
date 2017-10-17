import { db } from '~/db/init.js';

const select = {
  all: () =>
    db.any('SELECT * FROM animal'),
};

export { select };
