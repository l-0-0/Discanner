--to run the code in terminal
--psql antira -f sql/places.sql

DROP TABLE IF EXISTS places;


CREATE TABLE places(
    id SERIAL PRIMARY KEY,
    lat INT NOT NULL,
    lng INT NOT NULL,
    description VARCHAR NOT NULL CHECK (description <> ''),
    image VARCHAR,
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );









