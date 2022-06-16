const express = require('express');

const router = express.Router();
const { tokenDecoder } = require('../middleware/tokenDecoder');
const newsController = require('../controllers/newsControllers');

router.get('/', newsController.allNews);
router.post('/', tokenDecoder, newsController.addNewsUser);

module.exports = router;
