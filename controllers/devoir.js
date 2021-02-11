const Devoir = require('../models/devoir');

const devoirController = {};

devoirController.createDevoir = async (request, response, next) => {
    
    delete request.body._id;

    const devoir = new Devoir({
        ...request.body
    });

    await devoir.save()
        .then(() => response.status(201).json({ message: 'Le devoir est bien enregistré !'}))
        .catch(error => response.status(400).json({ error }))
    ;
}

devoirController.getOneDevoir = async (request, response, next) => {

    await Devoir.findOne({ _id: request.params.id })
        .then(devoir => {
            response.status(200).json(devoir)
        })
        .catch(error => response.status(404).json({ error }))
    ;
}

devoirController.modifyDevoir = async (request, response, next) => {

    await Devoir.updateOne(
        { 
            _id: request.params.id 
        },
        {
            ...request.body,
            _id: request.params.id 
        }
    )
    .then(() => response.status(200).json({ message: 'Le devoir a bien été modifié !'}))
    .catch(error => response.status(400).json({ error }));
}

devoirController.deleteDevoir = async (request, response, next) => {

    await Devoir.deleteOne({ _id: request.params.id })
        .then(() => response.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => response.status(400).json({ error }))
    ;
}

devoirController.getAllDevoir = async (request, response, next) => {

    await Devoir.find()
        .then(devoir => response.status(200).json(devoir))
        .catch(error => response.status(400).json({ error }))
    ;
}

module.exports = devoirController;