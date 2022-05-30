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
  editUser(req, res) {
    const { login } = req.body;
    const { file } = req;

    return User.findByPk(req.userId, {
      include: [{
        model: News,
        as: 'news',
        required: false,
      }],
    })
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'User Not Found',
          });
        }
        return user
          .update({ login, avatar: file?.path })
          .then((editUser) => {
            res.status(200).send(editUser);
          })
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
