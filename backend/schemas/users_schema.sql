CREATE TABLE IF NOT EXISTS users (
  id   BIGSERIAL PRIMARY KEY,
  username text  NOT NULL UNIQUE,
  password  text NOT NULL
);