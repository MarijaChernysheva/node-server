const jwt = require('jsonwebtoken');
require('dotenv').config();

const FORBIDDEN = 403;

const tokenDecoder = (req, res, next) => {
  const token = req.headers.authorization;
  const userId = jwt.verify(token, process.env.SECRET_KEY, (err, data) => {
    console.log(err)
    if (err) return res.status(FORBIDDEN).send();
    return data;
  });
  req.userId = userId;
  next();
};
module.exports = { tokenDecoder };
