const mongoose = require('mongoose');


const eleveSchema = mongoose.Schema(
    {
        firstName:      { type: String, required: true },
        lastName:       { type: String, required: true },
        moyenne:        { type: String, required: true },
        classe_d_ecole: { type: mongoose.Schema.Types.ObjectId, ref: 'ClasseDEcole'}
    }
);


module.exports = mongoose.model('Eleve', eleveSchema);