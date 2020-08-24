const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL || "postgres:postgres:Hoda@localhost:5432/antira"
);

module.exports.postImage = (id, url, post, time, title, lat, lng) => {
    let q = `INSERT INTO places (sender_id, image, description, time_incident, title, lat, lng) 
    VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
    let params = [id, url, post, time, title, lat, lng];
    return db.query(q, params);
};

module.exports.insertPosts = (id, post, time, title, lat, lng) => {
    let q = `INSERT INTO places (sender_id, description, time_incident, title, lat, lng) 
    VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
    let params = [id, post, time, title, lat, lng];
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

module.exports.updateImage = (lat, lng, url) => {
    let q = `UPDATE places SET image=$3 
    WHERE lat=$1 AND lng=$2 RETURNING *`;
    let params = [lat, lng, url];
    return db.query(q, params);
};
module.exports.updateReport = (lat, lng, posts, time, title) => {
    let q = `UPDATE places SET description=$3, time_incident= $4, title=$5 
    WHERE lat=$1 AND lng=$2 RETURNING *`;
    let params = [lat, lng, posts, time, title];
    return db.query(q, params);
};

module.exports.getEachPost = (id) => {
    let q = `SELECT * FROM places WHERE id=$1 `;
    let params = [id];
    return db.query(q, params);
};

module.exports.deletePoint = (id) => {
    let q = `DELETE FROM places WHERE id=$1`;
    let params = [id];
    return db.query(q, params);
};
