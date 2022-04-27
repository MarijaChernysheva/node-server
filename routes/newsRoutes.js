const express = require('express');

const router = express.Router();
const newsController = require('../controllers/newsControllers');

router.get('/', newsController.allNews);

module.exports = router;
