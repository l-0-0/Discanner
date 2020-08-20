const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL || "postgres:postgres:Hoda@localhost:5432/antira"
);

module.exports.postImage = (url, post, time, title, lat, lng) => {
    let q = `INSERT INTO places (image, description, time_incident, title, lat, lng) 
    VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
    let params = [url, post, time, title, lat, lng];
    return db.query(q, params);
};

module.exports.insertPosts = (post, time, title, lat, lng) => {
    let q = `INSERT INTO places (description, time_incident, title, lat, lng) 
    VALUES($1, $2, $3, $4, $5) RETURNING *`;
    let params = [post, time, title, lat, lng];
    return db.query(q, params);
};

module.exports.getAllPosts = () => {
    let q = `SELECT * FROM places ORDER BY ts DESC`;
    return db.query(q);
};

module.exports.register = function (firstName, lastName, email, password) {
    let q =
        "INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING first, last, id";
    let params = [firstName, lastName, email, password];
    return db.query(q, params);
};

module.exports.getPassword = function (email) {
    let q = "SELECT * FROM users WHERE email = $1";
    let params = [email];
    return db.query(q, params);
};

module.exports.userInfo = function (id) {
    let q = `SELECT id, first, last FROM users WHERE id=$1`;
    let params = [id];
    return db.query(q, params);
};
