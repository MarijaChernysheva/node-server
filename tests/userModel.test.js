
const { Sequelize, DataTypes } = require('sequelize');

const UserModel = require('../models/user');

const TEST_EMAIL = 'test@test.com';
const TEST_PASSWORD = 'test';
const TEST_LOGIN = 'test';
const TEST_AVATAR = 'test.png';

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
      login: TEST_LOGIN,
      password: TEST_PASSWORD,
      email: TEST_EMAIL,
      avatar: TEST_AVATAR,
    };

    const user = await User.create(userData);

    expect(user).toBeDefined();
    expect(user.login).toBe(TEST_LOGIN);
    expect(user.password).toBe(TEST_PASSWORD);
    expect(user.email).toBe(TEST_EMAIL);
    expect(user.avatar).toBe(TEST_AVATAR);
  });
})
