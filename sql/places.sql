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
    lat Decimal(18,15) NOT NULL,
    lng Decimal(18,15) NOT NULL,
    address VARCHAR,
    title VARCHAR,
    description VARCHAR,
    image VARCHAR,
    time_incident VARCHAR,
    sender_id INT REFERENCES users(id) NOT NULL,
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );









