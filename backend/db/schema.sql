-- http://stackoverflow.com/a/13318869/3192470
DROP DATABASE IF EXISTS :database;
CREATE DATABASE :database;

\c :database;

-- always use "user" (double quotes) when you reference this table.
-- because 'user' is a reserved word in postgres, and it will complain about user table.
-- alternative are:
--   1. renaming table to eg profile/learner. but course_learner_learns or course_profile_learns don't sound good.
--   2. all tables are in sigular, but consider this an exception and user users. but exception of writing 'user' instead of user is no more tedious.
CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  oauth_provider VARCHAR NOT NULL,
  oauth_id VARCHAR NOT NULL,
  username VARCHAR NOT NULL,
  avatar_url VARCHAR,
  email TEXT,
  unique (oauth_provider, oauth_id)
);

CREATE TABLE course (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL CHECK (char_length(title) >= 2),
  description TEXT,
  if_public BOOLEAN DEFAULT TRUE,

  user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE problem (
  id SERIAL PRIMARY KEY,

  type VARCHAR NOT NULL,
  -- inlinedAnswers
  -- separateAnswer
  content JSON,

  created_at TIMESTAMP NOT NULL,
  course_id INTEGER REFERENCES course (id) ON DELETE CASCADE NOT NULL
);

CREATE TABLE course_user_is_learning (
  id SERIAL PRIMARY KEY,

  active BOOLEAN NOT NULL, -- whether it's shown in /profile/learning

  course_id INTEGER REFERENCES course (id) ON DELETE CASCADE NOT NULL,
  user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE NOT NULL,
  unique (course_id, user_id)
);

-- this is the table only for already learned problems
CREATE TABLE problem_user_is_learning (
  id SERIAL PRIMARY KEY,

  easiness REAL NOT NULL,
  consecutive_correct_answers SMALLINT NOT NULL,
  next_due_date TIMESTAMP NOT NULL,

  problem_id INTEGER REFERENCES problem (id) ON DELETE CASCADE NOT NULL,
  course_user_is_learning_id INTEGER REFERENCES "course_user_is_learning" (id) ON DELETE CASCADE NOT NULL,
  unique (problem_id, course_user_is_learning_id),
  CHECK (consecutive_correct_answers >= 0)
);
