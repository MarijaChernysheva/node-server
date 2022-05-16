const express = require('express');

const router = express.Router();
const { tokenDecoder } = require('../middleware/tokenDecoder');
const { getUser } = require('../controllers/userControllers');

router.get('/:id', tokenDecoder, getUser);

module.exports = router;
