const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');


const classeDEcoleController = require('../controllers/classeDEcole');


router.post('/', auth, classeDEcoleController.createClasseDEcole);

router.get('/:id', classeDEcoleController.getOneClasseDEcole);

router.put('/:id', auth, classeDEcoleController.modifyClasseDEcole);

router.delete('/:id', auth, classeDEcoleController.deleteClasseDEcole);

router.get('/', classeDEcoleController.getAllClasseDEcole);

module.exports = router;