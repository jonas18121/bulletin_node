const express = require('express');

const router = express.Router();


const eleveController = require('../controllers/eleve');


router.post('/', eleveController.createEleve);

router.get('/:id', eleveController.getOneEleve);

router.put('/:id', eleveController.modifyEleve);

router.delete('/:id', eleveController.deleteEleve);

router.get('/', eleveController.getAllEleve);

module.exports = router;