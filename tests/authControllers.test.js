require('dotenv').config();

const bcrypt = require('bcrypt');

const authControllers = require('../controllers/authControllers');
const { User } = require('../models');

const TEST_EMAIL = 'test@test.com';
const TEST_PASSWORD = 'test';
const TEST_LOGIN = 'test';
const TEST_ID = 1;

jest.mock('../models', () => ({
  User: {
    findOne: jest.fn(),
    findOrCreate: jest.fn(),
  },
}));

describe('authControllers', () => {
  describe('signup', () => {
    const req = {
      body: {
        login: TEST_LOGIN,
        password: TEST_PASSWORD,
        email: TEST_EMAIL,
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    test('should handle successful registration', async () => {
  
      User.findOrCreate.mockResolvedValue([
        { id: TEST_ID, login: TEST_LOGIN, email: TEST_EMAIL },
        true,
      ]);
  
      await authControllers.signup(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        currentUser: {
          email: TEST_EMAIL,
          id: TEST_ID,
          login: TEST_LOGIN,
        },
        token: expect.any(String),
      });
    })
  
    test('should return error when user already exists', async () => {
  
      User.findOrCreate.mockResolvedValue([
        { id: TEST_ID, login: TEST_LOGIN, email: TEST_EMAIL },
        false,
      ]);
  
      await authControllers.signup(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'User is exist' });
    })
  })

  describe('login',  () => {
    const req ={
      body: { 
        password: TEST_PASSWORD,
        email: TEST_EMAIL,
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    test('should handle successful login', async () => {  
      User.findOne.mockResolvedValue({ 
        id: TEST_ID, 
        login: TEST_LOGIN, 
        email: TEST_EMAIL, 
        password: bcrypt.hashSync(TEST_PASSWORD, 10),
      });
      
      await authControllers.login(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        currentUser: {
          email: TEST_EMAIL,
          id: TEST_ID,
          login: TEST_LOGIN,
        },
        token: expect.any(String),
      });
    })

    test('should return massage when user is not found', async () => {
      User.findOne.mockResolvedValue(null);

      await authControllers.login(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'User is not found' })
    })

    test ('should return massage when password is invalid', async () => {
      User.findOne.mockResolvedValue({ 
        id: TEST_ID, 
        login: TEST_LOGIN, 
        email: TEST_EMAIL, 
        password: bcrypt.hashSync(TEST_PASSWORD, 10),
      });

      req.body.password = 'wrong_password';
      
      await authControllers.login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid password!'});
    })
  })
})
