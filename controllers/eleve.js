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



exports.getOneEleve = (req, res, next) => {

    Eleve.findOne({ _id: req.params.id })
        .then(thing => res.status(200).json(thing))
        .catch(error => res.status(404).json({ error }));
}


exports.modifyEleve = (req, res, next) => {

    Eleve.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => res.status(400).json({ error }));

}


exports.deleteEleve = (req, res, next) => {
    
    Eleve.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => res.status(400).json({ error }));
}


exports.getAllEleve = (request, response, next) => {

    Eleve.find()
        .then(things => response.status(200).json(things))
        .catch(error => response.status(400).json({ error }));
}