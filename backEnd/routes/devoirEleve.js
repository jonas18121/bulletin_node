const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const devoirEleveController = require('../controllers/devoirEleve');


router.post('/', auth, devoirEleveController.createDevoirEleve);

router.get('/:id', devoirEleveController.getOneDevoirEleve);

router.put('/:id', auth, devoirEleveController.modifyDevoirEleve);

router.delete('/:id', auth, devoirEleveController.deleteDevoirEleve);

router.get('/', devoirEleveController.getAllDevoirEleve);

module.exports = router;