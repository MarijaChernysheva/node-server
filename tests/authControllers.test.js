const bcrypt = require('bcrypt'); 
const authControllers = require('../controllers/authControllers');
const { User } = require('../models');
require('dotenv').config();

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
        login: 'test',
        password: 'test',
        email: 'test@test.com',
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    test('should handle successful registration', async () => {
  
      User.findOrCreate.mockResolvedValue([
        { id: 1, login: 'test', email: 'test@test.com' },
        true,
      ]);
  
      await authControllers.signup(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        currentUser: {
          email: 'test@test.com',
          id: 1,
          login: 'test',
        },
        token: expect.any(String),
      });
    })
  
    test('should return error when user already exists', async () => {
  
      User.findOrCreate.mockResolvedValue([
        { id: 1, login: 'test', email: 'test@test.com' },
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
        password: 'test',
        email: 'test@test.com'
      }
    }
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }

    test('should handle successful login', async () => {  
      User.findOne.mockResolvedValue({ 
        id: 1, 
        login: 'test', 
        email: 'test@test.com', 
        password: bcrypt.hashSync('test', 10),
      });
      
      await authControllers.login(req, res);
      
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        currentUser: {
          email: 'test@test.com',
          id: 1,
          login: 'test',
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
        id: 1, 
        login: 'test', 
        email: 'test@test.com', 
        password: bcrypt.hashSync('correct_password', 10),
      });

      req.body.password = 'wrong_password';
      
      await authControllers.login(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid password!'});
    })
  })
})
