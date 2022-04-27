const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    static associate() {
    }
  }
  News.init({
    title: DataTypes.STRING,
    text: DataTypes.STRING,
    tag: DataTypes.STRING,
    userId: DataTypes.STRING,
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'News',
  });
  return News;
};
