CREATE TABLE IF NOT EXISTS products (
  id   BIGSERIAL PRIMARY KEY,
  name text  NOT NULL,
  description  text NOT NULL,
  stock int NOT NULL,
  price float NOT NULL
);