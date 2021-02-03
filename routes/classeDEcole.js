const express = require('express');

const router = express.Router();


const classeDEcoleController = require('../controllers/classeDEcole');


router.post('/', classeDEcoleController.createClasseDEcole);

router.get('/:id', classeDEcoleController.getOneClasseDEcole);

router.put('/:id', classeDEcoleController.modifyClasseDEcole);

router.delete('/:id', classeDEcoleController.deleteClasseDEcole);

router.get('/', classeDEcoleController.getAllClasseDEcole);

module.exports = router;