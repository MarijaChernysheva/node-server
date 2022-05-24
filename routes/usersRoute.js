const express = require('express');

const router = express.Router();
const { tokenDecoder } = require('../middleware/tokenDecoder');
const { getUser, getAuthor } = require('../controllers/userControllers');

router.get('/', tokenDecoder, getAuthor);
router.get('/:id', tokenDecoder, getUser);

module.exports = router;
