const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User, News } = require('../models');

const salt = bcrypt.genSaltSync(10);

const OK = 200;
const BAD_REQUEST = 400;

module.exports = {
  signup(req, res) {
    const { login, password, email } = req.body;

    if (!login || !password || !email) {
      return res.status(BAD_REQUEST).send({ message: 'Enter data, please' });
    }

    return User.findOrCreate({
      where: {
        email,
      },
      defaults: {
        login,
        password: bcrypt.hashSync(password, salt),
        email,
      },
    })
      .then((user) => {
        if (!user[1]) return res.status(BAD_REQUEST).send({ message: 'User is exist' });
        return res.status(OK).send(user.id);
      })
      .catch((error) => res.status(BAD_REQUEST).send(error));
  },

  login(req, res) {
    const { password, email } = req.body;

    if (!password || !email) {
      return res.status(BAD_REQUEST).send({ message: 'Enter password or email, please' });
    }

    return User.findOne({
      where: {
        email,
      },
      include: [{
        model: News,
        as: 'news',
        required: false,
      }],
    })
      .then((user) => {
        if (!user) {
          return res.status(BAD_REQUEST).send({ message: 'User is not found' });
        }
        const passwordsValid = bcrypt.compareSync(password, user.password);
        if (!passwordsValid) return res.status(BAD_REQUEST).send({ massage: 'Invalid password!' });

        const token = jwt.sign(user.id, process.env.SECRET_KEY);

        return res.status(OK).json({
          user,
          token: `Bearer ${token}`,
        });
      })
      .catch((error) => res.status(BAD_REQUEST).send(error));
  },
};
