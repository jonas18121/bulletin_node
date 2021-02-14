const DevoirEleve = require('../models/devoirEleve');
const Eleve = require('../models/eleve');
const Devoir = require('../models/devoir');
const { populate } = require('../models/devoirEleve');
const ClasseDEcole = require('../models/classeDEcole');
const devoirEleve = require('../models/devoirEleve');

// $set  = ajouter
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

                // trouver l'élève et ensuite le modifier 
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

                        //trouver l'élève
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

                                    // modifier l'élève
                                    Eleve.updateOne({ _id: eleve._id }, eleve_modif)
                                        .then(
                                            () => {
                                                var moyenneclasseCurrent;
                                                var sommeclasseCurrent = 0;

                                                // trouver la classe
                                                ClasseDEcole.findOne({ _id: eleve_modif.classe_d_ecole._id })
                                                    .populate('eleves')
                                                    .then(classeCurrent => {

                                                        for(i = 0 ; i < classeCurrent.nbEleves ; i++)
                                                        {
                                                            moyenneclasseCurrent = classeCurrent.eleves[i].moyenne;
                            
                                                            sommeclasseCurrent += moyenneclasseCurrent ;
                                                        };
                            
                                                        classeCurrent.moyenneClasse = sommeclasseCurrent / classeCurrent.nbEleves;

                                                        // modifier la classe
                                                        ClasseDEcole.updateOne({ _id: eleve_modif.classe_d_ecole._id }, classeCurrent)
                                                            .then(() => { 
                                                                response.status(200).json({ message: 'La note de l\'élève a bien été remplacer pour ce devoir !' });
                                                            })
                                                            .catch(error => response.status(500).json({ error }))
                                                        ;
                            
                                                    })
                                                    .catch(error => response.status(500).json({ error }))
                                                ;
                                            }
                                        )
                                        .catch(error => response.status(400).json({ error }))
                                    ;
                                }
                            )
                            .catch(error => response.status(500).json({ error }))
                        ;
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

    await DevoirEleve.findByIdAndUpdate(
        { 
            _id: request.params.id 
        },
        {
            ...request.body,
            _id: request.params.id 
        }
    )
    .populate('id_eleve')
    .then( /*() => response.status(200).json({ message: 'La note entre le devoir et l\'élève a bien été modifié !'})*/
        devoirEleve => {
            
            // trouver l'élève
            Eleve.findOne({ _id: devoirEleve.id_eleve._id })
                .populate('devoir_eleves')
                .populate('classe_d_ecole')
                .then(

                    eleve_modif => {

                        var moyenne;
                        var sommeMoyenne = 0; 

                        // calcule de la moyenne de l'élève
                        for (let index = 0; index < eleve_modif.devoir_eleves.length; index++) {

                            moyenne = eleve_modif.devoir_eleves[index].note;

                            sommeMoyenne += moyenne;
                        }

                        eleve_modif.moyenne = sommeMoyenne / eleve_modif.devoir_eleves.length;

                        //modifier l'élève
                        Eleve.updateOne({ _id: devoirEleve.id_eleve._id }, eleve_modif)
                            .then(
                                () => 
                                    {   
                                        var moyenneclasseCurrent;
                                        var sommeclasseCurrent = 0;

                                        // trouver la classe
                                        ClasseDEcole.findOne({ _id: eleve_modif.classe_d_ecole._id })
                                            .populate('eleves')
                                            .then(classeCurrent => {

                                                // calculer la moyenne général de la classe
                                                for(i = 0 ; i < classeCurrent.nbEleves ; i++)
                                                {
                                                    moyenneclasseCurrent = classeCurrent.eleves[i].moyenne;
                    
                                                    sommeclasseCurrent += moyenneclasseCurrent ;
                                                };
                    
                                                classeCurrent.moyenneClasse = sommeclasseCurrent / classeCurrent.nbEleves;

                                                // modifier la classe
                                                ClasseDEcole.updateOne({ _id: eleve_modif.classe_d_ecole._id }, classeCurrent)
                                                    .then(() => { 
                                                        response.status(200).json({ message: 'La note de l\'élève a bien été remplacer pour ce devoir !' });
                                                    })
                                                    .catch(error => response.status(500).json({ error }))
                                                ;
                                            })
                                            .catch(error => response.status(500).json({ error }))
                                        ;
                                    }
                            )
                            .catch(error => response.status(500).json({ error }))
                        ;
                    }
                )
                .catch(error => response.status(500).json({ error }))
            ;
        }
    )
    .catch(error => response.status(400).json({ error }));
}

devoirEleveController.deleteDevoirEleve = async (request, response, next) => {

    /* await DevoirEleve.deleteOne({ _id: request.params.id })
        .then(() => response.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => response.status(400).json({ error }))
    ; */

    await DevoirEleve.findOneAndDelete({ _id: request.params.id })
        .then(
            devoirEleve => {
                console.log(devoirEleve);

                //trouver l'élève
                Eleve.findOne({ _id: devoirEleve.id_eleve })
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

                            // modifier l'élève
                            Eleve.updateOne({ _id: devoirEleve.id_eleve }, eleve_modif)
                                .then(
                                    () => {
                                        var moyenneclasseCurrent;
                                        var sommeclasseCurrent = 0;

                                        // trouver la classe
                                        ClasseDEcole.findOne({ _id: eleve_modif.classe_d_ecole._id })
                                            .populate('eleves')
                                            .then(classeCurrent => {

                                                for(i = 0 ; i < classeCurrent.nbEleves ; i++)
                                                {
                                                    moyenneclasseCurrent = classeCurrent.eleves[i].moyenne;
                    
                                                    sommeclasseCurrent += moyenneclasseCurrent ;
                                                };
                    
                                                classeCurrent.moyenneClasse = sommeclasseCurrent / classeCurrent.nbEleves;

                                                // modifier la classe
                                                ClasseDEcole.updateOne({ _id: eleve_modif.classe_d_ecole._id }, classeCurrent)
                                                    .then(() => { 
                                                        response.status(200).json(
                                                            { 
                                                                message: 'La note de l\'élève a bien été supprimer pour ce devoir et on a recalculer la moyenne de l\'élève ainsi que la moyenne général de la classe !' 
                                                            }
                                                        );
                                                    })
                                                    .catch(error => response.status(500).json({ error }))
                                                ;
                    
                                            })
                                            .catch(error => response.status(500).json({ error }))
                                        ;
                                    }
                                )
                                .catch(error => response.status(400).json({ error }))
                            ;
                        }
                    )
                    .catch(error => response.status(500).json({ error }))
                ;
            }
        )
        .catch(error => response.status(500).json({ error }))
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