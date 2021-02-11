const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const devoirController = require('../controllers/devoir');


router.post('/', auth, devoirController.createDevoir);

router.get('/:id', devoirController.getOneDevoir);

router.put('/:id', auth, devoirController.modifyDevoir);

router.delete('/:id', auth, devoirController.deleteDevoir);

router.get('/', devoirController.getAllDevoir);

module.exports = router;