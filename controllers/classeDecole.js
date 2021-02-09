const ClasseDEcole = require('../models/classeDEcole');



exports.createClasseDEcole = async (request, response, next) => {

    delete request.body._id;

    const classeDEcole = new ClasseDEcole({

        ...request.body

    });

    await classeDEcole.save()
        .then(() => response.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => response.status(400).json({ error }))
    ;
}



exports.getOneClasseDEcole = async (request, response, next) => {

    await ClasseDEcole.findOne({ _id: request.params.id })
        .populate('eleves')
        .then(classeDEcole => {
            response.status(200).json(classeDEcole)
        })
        .catch(error => response.status(404).json({ error }))
    ;
}


exports.modifyClasseDEcole = async (request, response, next) => {

    await ClasseDEcole.updateOne({ _id: request.params.id }, { ...request.body, _id: request.params.id })
        .then(() => response.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => response.status(400).json({ error }))
    ;
}


exports.deleteClasseDEcole = async (request, response, next) => {
    
    await ClasseDEcole.deleteOne({ _id: request.params.id })
        .then(() => response.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => response.status(400).json({ error }));
}


exports.getAllClasseDEcole = async (request, response, next) => {

    await ClasseDEcole.find()
        .then(classeDEcole => response.status(200).json(classeDEcole))
        .catch(error => response.status(400).json({ error }));
}