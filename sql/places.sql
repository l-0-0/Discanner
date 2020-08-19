--to run the code in terminal
--psql antira -f sql/places.sql

DROP TABLE IF EXISTS places;


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









