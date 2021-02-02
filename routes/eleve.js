const express = require('express');

const router = express.router();


const eleveController = require('../controllers/eleve');


app.post('/', eleveController.createEleve);

app.get('/:id', eleveController.getOneEleve);

app.put('/:id', eleveController.modifyEleve);

app.delete('/:id', eleveController.deleteEleve);

app.get('/', eleveController.getAllEleve);

module.exports = router;