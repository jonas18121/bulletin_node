const express = require('express');

/** pour MongoDB */
const mongoose = require('mongoose');

const app = express();

const Eleve = require('./models/eleve');


const uri = `mongodb://localhost:27017/bulletin_node`;

/**
* connexion à MongoDB
*/
mongoose.connect(uri,
    { useNewUrlParser: true,
        useUnifiedTopology: true 
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

const bodyParser = require('body-parser');

app.use((request, response, next) => {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());





app.post('/api/eleve', (request, response, next) => {

    delete request.body._id;

    const eleve = new Eleve({

        ...request.body

    });

    eleve.save()
        .then(() => response.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => response.status(400).json({ error }))
    ;

});


app.get('/api/eleve/:id', (req, res, next) => {

    Eleve.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
});

app.put('/api/eleve/:id', (req, res, next) => {

    Eleve.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));

});

app.delete('/api/eleve/:id', (req, res, next) => {
    
    Eleve.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
});

app.get('/api/eleve', (request, response, next) => {

    Eleve.find()
        .then(things => response.status(200).json(things))
        .catch(error => response.status(400).json({ error }));
});

module.exports = app;