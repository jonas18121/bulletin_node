const mongoose = require('mongoose');

const devoirEleveSchema = mongoose.Schema(
    {
        note: {
            type: Number,
            required: true
        },
        id_eleve: {
            type: Number,
            required: true
        },
        id_devoir: {
            type: Number,
            required: true
        },
    }
);

module.exports = mongoose.model('DevoirEleve', devoirEleveSchema)