const { News, User } = require('../models');

const OK = 200;
const BAD_REQUEST = 400;

module.exports = {
  allNews(req, res) {
    return News
      .findAll({
        order: [
          ['createdAt', 'ASC'],
        ],
        include: [{
          model: User,
          as: 'user',
          required: false,
        }],
      })
      .then((news) => res.status(OK).send(news))
      .catch((error) => res.status(BAD_REQUEST).send(error));
  },

  addNewsUser(req, res) {
    const { title, text, tag } = req.body;
    const userId = req.userId;
    return News
      .create 
      ({ 
        title,
        text,
        tag,
        userId,
      })
      .then(() => res.sendStatus(OK))
      .catch((error) => res.status(BAD_REQUEST).send(error));
  },
};
