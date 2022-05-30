const express = require('express');
const multer = require('multer');

const router = express.Router();
const { tokenDecoder } = require('../middleware/tokenDecoder');
const { getUser, getAuthor, editUser } = require('../controllers/userControllers');

// const upload = multer({ dest: 'images/' });
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname.replace(/(.png|.jpg|.svg|.jpeg)$/ig, `${Date.now()}$&`));
  },
});

router.get('/', tokenDecoder, getAuthor);
router.get('/:id', tokenDecoder, getUser);
router.patch('/', multer({ storage: storageConfig }).single('file'), tokenDecoder, editUser);

module.exports = router;
