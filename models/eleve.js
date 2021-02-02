const mongoose = require('mongoose');


const eleveSchema = mongoose.Schema(
    {
        firstName:   { type: String, required: true },
        lastName:    { type: String, required: true },
        moyenne:     { type: String, required: true },
    }
);


module.exports = mongoose.model('Eleve', eleveSchema);