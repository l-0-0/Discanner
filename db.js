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
