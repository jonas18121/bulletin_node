const mongoose = require('mongoose');


const classeDEcoleSchema = mongoose.Schema(
    {
        numeroClasse:    { type: Number, required: true },
        moyenneClasse:   { type: Number, required: true },
        nbEleves:        { type: Number, required: true },
        eleves :         [{ type: mongoose.Schema.Types.ObjectId, ref: 'Eleve' }],
    }
);


module.exports = mongoose.model('ClasseDEcole', classeDEcoleSchema);