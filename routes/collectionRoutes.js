const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { createCollection } = require('../controllers/collectionController');

router.post('/create', upload.array('images', 20), createCollection);

module.exports = router;
