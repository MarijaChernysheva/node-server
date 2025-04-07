const request = require('supertest');
const express = require('express');
const usersRoute = require('../routes/usersRoute')

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
    req.userId = 1;
    next();
  })
}))

describe('usersRoute', () => {
  test('GET /users - must return the authors by id', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1 });

  })
  test('GET /users/:id - must return the author', async () => {
    const userId = 123;
    const response = await request(app).get(`/users/${userId}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({id: String(userId)})
  })
  test('PATCH /users - must edit author', async () => {
    const response = await request(app)
      .patch('/users')
      .send({ login: 'user123' })
      .set('Authorization', 'Bearer someValidToken');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({id: 1, login: 'user123'});
  })
})

