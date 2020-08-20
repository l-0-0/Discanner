--to run the code in terminal
--psql antira -f sql/places.sql

DROP TABLE IF EXISTS places;
DROP TABLE IF EXISTS users;


CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL CHECK (first != ''),
      last VARCHAR(255) NOT NULL CHECK (last != ''),
      email VARCHAR(255) NOT NULL UNIQUE CHECK (email != ''),
      password VARCHAR(255) NOT NULL CHECK (password != ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

CREATE TABLE places(
    id SERIAL PRIMARY KEY,
    lat Decimal(8,6) NOT NULL,
    lng Decimal(9,6) NOT NULL,
    address VARCHAR,
    title VARCHAR,
    description VARCHAR NOT NULL CHECK (description <> ''),
    image VARCHAR,
    time_incident VARCHAR NOT NULL,
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );









