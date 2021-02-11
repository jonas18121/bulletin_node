const mongoose = require('mongoose');

const devoirEleveSchema = mongoose.Schema(
    {
        note: {
            type: Number,
            required: true
        },
        id_eleve: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Eleve' 
        },
        id_devoir: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Devoir' 
        },
    }
);

module.exports = mongoose.model('DevoirEleve', devoirEleveSchema)