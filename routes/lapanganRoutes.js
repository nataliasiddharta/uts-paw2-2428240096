const express = require('express');
const router = express.Router();
const lapanganController = require('../controllers/lapanganController');
const cekApiKey = require('../middlewares/cekApiKey');

router.get('/', lapanganController.getAll);
router.get('/:id', lapanganController.getById);
router.post('/', cekApiKey, lapanganController.create);
router.put('/:id', cekApiKey, lapanganController.update);
router.delete('/:id', cekApiKey, lapanganController.remove);

module.exports = router;

