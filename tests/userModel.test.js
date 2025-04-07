
const { Sequelize, DataTypes } = require('sequelize');
const UserModel = require('../models/user');

describe('User model', () => {
  let sequelize;
  let User;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });
    User = UserModel(sequelize, DataTypes);
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    if (sequelize) {
      await sequelize.close();
    }
  });

  test('should create a user with correct attributes', async () => {
    const userData = {
      login: 'test',
      password: 'test',
      email: 'test@test.com',
      avatar: 'test.png'
    };

    const user = await User.create(userData);

    expect(user).toBeDefined();
    expect(user.login).toBe('test');
    expect(user.password).toBe('test');
    expect(user.email).toBe('test@test.com');
    expect(user.avatar).toBe('test.png');
  });
})
