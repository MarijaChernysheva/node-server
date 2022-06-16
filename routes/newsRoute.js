const express = require('express');
// const multer = require('multer');

const router = express.Router();
const { tokenDecoder } = require('../middleware/tokenDecoder');
const newsController = require('../controllers/newsControllers');

// const storageConfig = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, './public/images');
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.originalname.replace(/(.png|.jpg|.svg|.jpeg)$/ig, `${Date.now()}$&`));
//     },
//   });

router.get('/', newsController.allNews);
router.post('/', tokenDecoder, newsController.addNewsUser);

module.exports = router;
