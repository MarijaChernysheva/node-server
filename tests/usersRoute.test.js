const express = require('express');
const request = require('supertest');

const usersRoute = require('../routes/usersRoute')

const TEST_LOGIN = 'test';
const TEST_ID = 1;

const app = express();
app.use(express.json());
app.use('/users', usersRoute);

jest.mock('../controllers/userControllers', () => ({
  getUser: jest.fn((req, res) => {res.status(200).json({ id: req.params.id})}),
  getAuthor: jest.fn((req, res) => {res.status(200).json({ id: req.userId})}),
  editUser: jest.fn((req, res) => {res.status(200).json({ id: req.userId, login: req.body.login})}),
}))

jest.mock('../middleware/tokenDecoder.js', () =>({
  tokenDecoder: jest.fn((req, _, next) => {
    req.userId = TEST_ID;
    next();
  })
}))

describe('usersRoute', () => {
  test('GET /users - must return the authors', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: TEST_ID });

  })
  test('GET /users/:id - must return the author by id', async () => {
    const response = await request(app).get(`/users/${TEST_ID}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({id: String(TEST_ID)})
  })
  test('PATCH /users - must edit author', async () => {
    const response = await request(app)
      .patch('/users')
      .send({ login: TEST_LOGIN })
      .set('Authorization', 'Bearer someValidToken');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({id: TEST_ID, login: TEST_LOGIN});
  })
})

