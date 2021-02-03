const express = require('express');

/** pour MongoDB */
const mongoose = require('mongoose');

const app = express();

// const Eleve = require('./models/eleve');

const eleveRoutes = require('./routes/eleve');
const classeDECloeRoutes = require('./routes/classeDEcole');

const path = require('path');


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


app.use('/api/eleves', eleveRoutes);
app.use('/api/classe_d_ecoles', classeDECloeRoutes);

module.exports = app;