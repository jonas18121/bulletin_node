const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');

const eleveController = require('../controllers/eleve');


router.post('/', auth, eleveController.createEleve);

router.get('/:id', eleveController.getOneEleve);

router.put('/:id', auth, eleveController.modifyEleve);

router.delete('/:id', auth, eleveController.deleteEleve);

router.get('/', eleveController.getAllEleve);

module.exports = router;