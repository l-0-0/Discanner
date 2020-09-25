const bcrypt = require("bcryptjs");
//three functions bcrypt gives us:
let { genSalt, hash, compare } = bcrypt;
const { promisify } = require("util");

genSalt = promisify(genSalt);
hash = promisify(hash);
compare = promisify(compare);

module.exports.compare = compare;
module.exports.hash = (plainTxPw) =>
    genSalt().then((salt) => hash(plainTxPw, salt));
