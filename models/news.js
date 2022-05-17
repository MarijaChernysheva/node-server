const {
  Model,
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class News extends Model {
    static associate(models) {
      News.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  News.init({
    title: DataTypes.STRING,
    text: DataTypes.STRING,
    tag: DataTypes.STRING,
    userId: DataTypes.NUMBER,
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'News',
  });
  return News;
};
