import { db } from '~/db/init.js';

const destroy = (id) =>
  db.none('delete from "user" where id=${id}', { id });

import { insert } from './insert';
import { select } from './select';

export { insert, select, destroy };
