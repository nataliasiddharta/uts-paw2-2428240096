const express = require('express');
const router = express.Router();
const venueController = require('../controllers/venueController');
const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', venueController.getAll);
router.post('/', cekApiKey, venueController.create);

module.exports = router;

