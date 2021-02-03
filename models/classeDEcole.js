const mongoose = require('mongoose');


const classeDEcoleSchema = mongoose.Schema(
    {
        numeroClasse:    { type: Number, required: true },
        moyenneClasse:   { type: Number, required: true },
        nbEleves:        { type: Number, required: true },
        eleves :         { type: Number, required: true },
    }
);


module.exports = mongoose.model('ClasseDEcole', classeDEcoleSchema);