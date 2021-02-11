const DevoirEleve = require('../models/devoirEleve');
const Eleve = require('../models/eleve');
const Devoir = require('../models/devoir');
const { populate } = require('../models/devoirEleve');
const eleve = require('../models/eleve');

// $set = ajouter
// $pull = retirer

const devoirEleveController = {};

devoirEleveController.createDevoirEleve = async (request, response, next) => {
    
    delete request.body._id;

    const devoirEleve = new DevoirEleve({
        ...request.body
    });

    await devoirEleve.save()
        .then(/*() => response.status(201).json({ message: 'Le devoir est bien associé à un élève, et bien enregistré !'})*/
            devoirEleve => {
                Eleve.findByIdAndUpdate(
                    { 
                        _id: devoirEleve.id_eleve 
                    },
                    {
                        $set: 
                            {
                                devoir_eleves: devoirEleve._id
                            }
                    }
                )
                .then(
                    () => {
                        response.status(201).json({ message: 'Le devoir est bien associé à un élève, et bien enregistré !'})
                    }
                )
                .catch(error => response.status(400).json({ error }));
            }
        )
        .catch(error => response.status(400).json({ error }))
    ;
}

devoirEleveController.getOneDevoirEleve = async (request, response, next) => {

    await DevoirEleve.findOne({ _id: request.params.id })
        .populate('id_eleve')
        .populate('id_devoir')
        .then(devoirEleve => {
            response.status(200).json(devoirEleve)
        })
        .catch(error => response.status(404).json({ error }))
    ;
}

devoirEleveController.modifyDevoirEleve = async (request, response, next) => {

    await DevoirEleve.updateOne(
        { 
            _id: request.params.id 
        },
        {
            ...request.body,
            _id: request.params.id 
        }
    )
    .then(() => response.status(200).json({ message: 'Le lien entre le devoir et l\'élève a bien été modifié !'}))
    .catch(error => response.status(400).json({ error }));
}

devoirEleveController.deleteDevoirEleve = async (request, response, next) => {

    await DevoirEleve.deleteOne({ _id: request.params.id })
        .then(() => response.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => response.status(400).json({ error }))
    ;
}

devoirEleveController.getAllDevoirEleve = async (request, response, next) => {

    await DevoirEleve.find()
        .populate('id_eleve')
        .populate('id_devoir')
        .then(devoirEleve => response.status(200).json(devoirEleve))
        .catch(error => response.status(400).json({ error }))
    ;
}

module.exports = devoirEleveController;