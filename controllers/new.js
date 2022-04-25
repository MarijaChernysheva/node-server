const { New } = require('../models');

const OK = 200;
const BAD_REQUEST = 400;

module.exports = {
  allNews(req, res) {
    return New
      .findAll({
        order: [
          ['createdAt', 'ASC'],
        ],
      })
      .then((news) => res.status(OK).send(news))
      .catch((error) => res.status(BAD_REQUEST).send(error));
    }
}