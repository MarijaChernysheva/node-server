const { User, News } = require('../models');

const OK = 200;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;

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
  editUser(req, res) {
    return User.findByPk(req.userId, {
      include: [{
        model: News,
        as: 'news',
        required: false,
      }],
    })
      .then((user) => {
        if (!user) {
          return res.status(NOT_FOUND).send({
            message: 'User Not Found',
          });
        }
        return user
          .update({ login: req.body.login, avatar: req.file?.path })
          .then((editUser) => {
            res.status(OK).send(editUser);
          })
          .catch((error) => res.status(BAD_REQUEST).send(error));
      })
      .catch((error) => res.status(BAD_REQUEST).send(error));
  },
};
