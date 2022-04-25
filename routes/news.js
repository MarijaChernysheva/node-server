const express = require('express');
const router = express.Router();
const newsController = require('../controllers/new');

router.get('/', newsController.allNews);

module.exports = router;