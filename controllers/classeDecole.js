const ClasseDEcole = require('../models/classeDEcole');



exports.createClasseDEcole = (request, response, next) => {

    delete request.body._id;

    const classeDEcole = new ClasseDEcole({

        ...request.body

    });

    classeDEcole.save()
        .then(() => response.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => response.status(400).json({ error }))
    ;
}



exports.getOneClasseDEcole = (request, response, next) => {

    ClasseDEcole.findOne({ _id: request.params.id })
        .then(classeDEcole => response.status(200).json(classeDEcole))
        .catch(error => response.status(404).json({ error }));
}


exports.modifyClasseDEcole = (request, response, next) => {

    ClasseDEcole.updateOne({ _id: request.params.id }, { ...request.body, _id: request.params.id })
        .then(() => response.status(200).json({ message: 'Objet modifié !'}))
        .catch(error => response.status(400).json({ error }));

}


exports.deleteClasseDEcole = (request, response, next) => {
    
    ClasseDEcole.deleteOne({ _id: request.params.id })
        .then(() => response.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => response.status(400).json({ error }));
}


exports.getAllClasseDEcole = (request, response, next) => {

    ClasseDEcole.find()
        .then(classeDEcole => response.status(200).json(classeDEcole))
        .catch(error => response.status(400).json({ error }));
}