const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { User } = require('../models');

const salt = bcrypt.genSaltSync(10);

const OK = 200;
const BAD_REQUEST = 400;

module.exports = {
  signup(req, res) {
    const { login, password, email } = req.body;

    if (!login || !password || !email) {
      return res.status(OK).send({ error: 'Enter data, please' });
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
        if (!user[1]) return res.status(OK).send({ error: 'User is exist' });
        return res.status(OK).send({ created: user[1] });
      })
      .catch((error) => res.status(BAD_REQUEST).send(error));
  },

  login(req, res) {
    const { password, email } = req.body;

    if (!password || !email) {
      return res.status(OK).send({ error: 'Enter password or email, please' });
    }

    return User.findOne({
      where: {
        email,
      },
    })
      .then((user) => {
        if (!user) {
          return res.status(OK).send({ error: 'User is not found' });
        }
        const passwordsValid = bcrypt.compareSync(password, user.password);
        if (!passwordsValid) return res.status(OK).send({ error: 'Invalid password!' });

        const token = jwt.sign(user.id, process.env.SECRET_KEY);

        const currentUser = {
          email: user.email,
          id: user.id,
          login: user.login,
        };

        return res.status(OK).json({
          currentUser,
          token: `Bearer ${token}`,
        });
      })
      .catch((error) => res.status(BAD_REQUEST).send(error));
  },
};
