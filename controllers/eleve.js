const Eleve = require('../models/eleve');



exports.createEleve = (request, response, next) => {

    delete request.body._id;

    const eleve = new Eleve({

        ...request.body

    });

    eleve.save()
        .then(() => response.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => response.status(400).json({ error }))
    ;
}



exports.getOneEleve = (request, response, next) => {

    Eleve.findOne({ _id: request.params.id })
        .then(eleve => response.status(200).json(eleve))
        .catch(error => response.status(404).json({ error }));
}


exports.modifyEleve = (request, response, next) => {

    Eleve.updateOne({ _id: request.params.id }, { ...request.body, _id: request.params.id })
        .then(() => response.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => response.status(400).json({ error }));

}


exports.deleteEleve = (request, response, next) => {
    
    Eleve.deleteOne({ _id: request.params.id })
        .then(() => response.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => response.status(400).json({ error }));
}


exports.getAllEleve = (request, response, next) => {

    Eleve.find()
        .then(eleve => response.status(200).json(eleve))
        .catch(error => response.status(400).json({ error }));
}