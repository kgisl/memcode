import { db } from '~/db/init.js';
import { camelizeDbColumns } from '~/services/camelizeDbColumns';

import { fetchCoursesAndTheirStats } from '~/model/select';

const select = {
  allCreated: (userId) =>
    fetchCoursesAndTheirStats(`WHERE course.user_id = \${userId}`, '', userId),

  // for /profile. returns all courses userId is currently learning.
  // only active,
  // filtered by amount of due problems (TODO)
  allLearned: (userId) =>
    fetchCoursesAndTheirStats(
      `
        WHERE course_user_is_learning.user_id = \${userId} AND course_user_is_learning.active = true
      `,
      `
        ORDER BY
          amount_of_problems_to_review DESC,
          amount_of_problems_to_learn DESC,
          next_due_date_in ASC
      `,
      userId
    ),

  // all public courses with 2 or more problems
  allPublic: () =>
    db.any(
      `
        SELECT
          row_to_json(course.*) AS course,
          COUNT(problem.id)     AS amount_of_problems,
          COUNT(DISTINCT course_user_is_learning.user_id) AS amount_of_users_learning_this_course
        FROM course
        LEFT OUTER JOIN problem
          ON problem.course_id = course.id
        INNER JOIN course_user_is_learning
          ON course_user_is_learning.course_id = course.id
        WHERE
          if_public = true
            AND
          (
            SELECT COUNT(problem.id) FROM problem WHERE problem.course_id = course.id
          ) >= 2
        GROUP BY course.id
        ORDER BY amount_of_problems DESC
      `,
    )
      .then(array => camelizeDbColumns(array, ['course'])),

  oneForActions: (id, userId) =>
    fetchCoursesAndTheirStats(`WHERE course.id = ${id}`, '', userId)
      .then((array) => array[0]),

  oneById: (id) =>
    db.one(
      `
      SELECT *
      FROM course
      WHERE course.id = \${id}
      `,
      { id }
    )
};

export { select };
