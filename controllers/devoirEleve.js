const DevoirEleve = require('../models/devoirEleve');
const Eleve = require('../models/eleve');
const Devoir = require('../models/devoir');
const { populate } = require('../models/devoirEleve');
const eleve = require('../models/eleve');

// $set = ajouter
// $pull = retirer
// $push = ajouter dans tableau

const devoirEleveController = {};

devoirEleveController.createDevoirEleve = async (request, response, next) => {
    
    delete request.body._id;

    const devoirEleve = new DevoirEleve({
        ...request.body
    });

    await devoirEleve.save()
        .then(
            devoirEleve => {
                Eleve.findByIdAndUpdate(
                    { 
                        _id: devoirEleve.id_eleve 
                    },
                    {
                        $push: 
                            {
                                devoir_eleves: devoirEleve._id
                            }
                    }
                )
                .then(
                    eleve => {
                        Eleve.findOne({ _id: eleve._id })
                            .populate('devoir_eleves')
                            .then(

                                eleve_modif => {

                                    var moyenne;
                                    var sommeMoyenne = 0; 

                                    for (let index = 0; index < eleve_modif.devoir_eleves.length; index++) {

                                        moyenne = eleve_modif.devoir_eleves[index].note;

                                        sommeMoyenne += moyenne;
                                    }

                                    eleve_modif.moyenne = sommeMoyenne / eleve_modif.devoir_eleves.length;

                                    Eleve.updateOne({ _id: eleve._id }, eleve_modif)
                                        .then(
                                            () => response.status(200).json({ message: 'Le devoir est bien associé à un élève, et bien enregistré !' })
                                        )
                                        .catch(error => response.status(400).json({ error }))
                                        ;
                                }
                            )
                    }
                )
                .catch(error => response.status(500).json({ error }));
            }
        )
        .catch(error => response.status(500).json({ error }))
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