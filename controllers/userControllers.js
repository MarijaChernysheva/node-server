const { User, News } = require('../models');

const OK = 200;
const BAD_REQUEST = 400;

module.exports = {
  getUser(req, res) {
    return User.findOne(
      {
        where: { id: req.params.id },
        include: [{
          model: News,
          as: 'news',
          required: false,
        }],
      },
    )
      .then((user) => res.status(OK).send(user))
      .catch((error) => res.status(BAD_REQUEST).send(error));
  },
  getAuthor(req, res) {
    return User.findOne(
      {
        where: { id: req.userId },
        include: [{
          model: News,
          as: 'news',
          required: false,
        }],
      },
    )
      .then((author) => res.status(OK).send(author))
      .catch((error) => res.status(BAD_REQUEST).send(error));
  },
};
