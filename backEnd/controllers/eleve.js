const Eleve = require('../models/eleve');
const mongoose = require('mongoose');
const { populate } = require('../models/eleve');
const ClasseDEcole = require('../models/classeDEcole');



exports.createEleve = async (request, response, next) => {

    delete request.body._id;

    const eleve = new Eleve({
        _id: new mongoose.Types.ObjectId(),
        ...request.body
        
    });

    await eleve.save()
        .then(() => ClasseDEcole.findOne({ _id: eleve.classe_d_ecole })
            .then(classe => {

                classe.eleves.push(eleve);
                classe.nbEleves.push(classe.eleves.length);
                // console.log(classe.eleves.length);

                ClasseDEcole.updateOne({_id: classe.id}, classe)
                    .then(() => response.status(201).json({ message: 'Le nouvel élève a bien été enregistré !'}))
                    .catch(error => response.status(400).json({ error }))
                ;
            })
        )
        .catch(error => response.status(400).json({ error }))
    ;
}



exports.getOneEleve = async (request, response, next) => {

    await Eleve.findOne({ _id: request.params.id })
        .populate('classe_d_ecole')
        .populate('devoir_eleves')
        .then(eleve => {response.status(200).json(eleve)})
        .catch(error => response.status(404).json({ error }))
    ;
}


exports.modifyEleve = async (request, response, next) => {

    await Eleve.findOne({ _id: request.params.id })
        .populate('classe_d_ecole')
        .then(eleve => {

            

            //si il y a un changement de classe lors de la modification de l'élève 
            if (eleve.classe_d_ecole._id != request.body.classe_d_ecole) {
                
                // trouver l'ancienne classe de l'élève
                ClasseDEcole.findOne({ _id: eleve.classe_d_ecole._id })
                    .populate('eleves')
                    .then(oldClasse => {

                        var sommeOldClasse = 0;

                        // supprimer l'id de l'élève dans l'ancienne classe
                        oldClasse.eleves.splice(oldClasse.eleves.indexOf(eleve._id),1);
                        oldClasse.nbEleves = oldClasse.eleves.length;
                        

                        console.log('avant for de l\'ancienne classe ' + oldClasse.eleves);
                        for(i = 0 ; i < oldClasse.nbEleves ; i++)
                        {

                            
                            console.log('pendant for de l\'ancienne classe ' + oldClasse.eleves[i].moyenne);
                            moyenneOldClasse = oldClasse.eleves[i].moyenne;

                            console.log('voici la moyenne de l\'ancienne classe ' + moyenneOldClasse);
                            sommeOldClasse += moyenneOldClasse ;

                        };
                        console.log('après for de l\'ancienne classe ' + sommeOldClasse);

                        oldClasse.moyenneClasse = sommeOldClasse / oldClasse.nbEleves;
                        console.log('moyenne de l\'ancienne classe ' + oldClasse.moyenneClasse);

                        // console.log('ancienne classe ' + oldClasse);

                        //modifier l'ancienne classe de l'élève
                        ClasseDEcole.updateOne({ _id: eleve.classe_d_ecole._id }, oldClasse)
                            .then(()=> {

                                // trouver la nouvelle classe de l'élève
                                ClasseDEcole.findOne({ _id: request.body.classe_d_ecole })
                                    .populate('eleves')
                                    .then(newClasse => {

                                        var sommeNewClasse = 0;
                                        console.log('E L E V E ' + eleve);

                                        // ajouter l'élève dans sa nouvelle classe
                                        newClasse.eleves.push(eleve);

                                        newClasse.nbEleves = newClasse.eleves.length;
                                        console.log('nombre d\'élève dans la nouvelle classe ' + newClasse.nbEleves);

                                        console.log('avant for nouvelle classe ' + newClasse.eleves);
                                        for(i = 0 ; i < newClasse.nbEleves ; i++)
                                        {

                                            
                                            console.log('pendant for nouvelle classe ' + newClasse.eleves[i].moyenne);
                                            moyenneNewClasse = newClasse.eleves[i].moyenne;

                                            console.log('voici la moyenne nouvelle classe ' + moyenneNewClasse);
                                            sommeNewClasse += moyenneNewClasse ;

                                        };
                                        console.log('après for nouvelle classe ' + sommeNewClasse);

                                        newClasse.moyenneClasse = sommeNewClasse / newClasse.nbEleves;
                                        console.log('moyenne de la nouvelle classe nouvelle classe ' + newClasse.moyenneClasse);

                                        
                                        //modifier la nouvelle classe
                                        ClasseDEcole.updateOne({ _id: request.body.classe_d_ecole }, newClasse)
                                            .then(() => { 

                                                // modifier l'élève
                                                Eleve.updateOne({ _id: request.params.id }, { ...request.body, _id: request.params.id })
                                                    .then(() => response.status(200).json({ message: 'L\'élève a été bien mis dans sa nouvelle classe'}))
                                                    .catch(error => response.status(500).json({ error }))
                                                ;
                                            })
                                            .catch(error => response.status(500).json({ error }))
                                        ;
                                    })
                                    .catch(error => response.status(500).json({ error }))
                                ;
                            })
                            .catch(error => response.status(500).json({ error }))
                        ;
                    })
                    .catch(error => response.status(400).json({ error }))
                ;
            }
            else{

                    // request.body.moyenne
                console.log(eleve.moyenne != request.body.moyenne);

                if (eleve.moyenne != request.body.moyenne) {

                    sommeclasseCurrent = 0;
                    
                    // trouver la classe de l'élève
                    ClasseDEcole.findOne({ _id: eleve.classe_d_ecole._id })
                        .populate('eleves')
                        .then(classeCurrent => {

                            console.log('avant for de la classe actuelle ' + classeCurrent.eleves);
                            for(i = 0 ; i < classeCurrent.nbEleves ; i++)
                            {

                                
                                console.log('pendant for de la classe actuelle ' + classeCurrent.eleves[i].moyenne);
                                moyenneclasseCurrent = classeCurrent.eleves[i].moyenne;

                                console.log('voici la moyenne de la classe actuelle ' + moyenneclasseCurrent);
                                sommeclasseCurrent += moyenneclasseCurrent ;

                            };
                            console.log('après for de la classe actuelle ' + sommeclasseCurrent);

                            classeCurrent.moyenneClasse = sommeclasseCurrent / classeCurrent.nbEleves;
                            console.log('moyenne de la classe actuelle ' + classeCurrent.moyenneClasse);

                        })
                        .catch(error => response.status(500).json({ error }))
                    ;
                }

                // modifier l'élève
                Eleve.updateOne({ _id: request.params.id }, { ...request.body, _id: request.params.id })
                    .then(() => response.status(200).json({ message: 'L\'élève a bien été modifié !'}))
                    .catch(error => response.status(400).json({ error }))
                ;
            }
        })
    ; 
}


exports.deleteEleve = async (request, response, next) => {

    await Eleve.findOne({ _id: request.params.id })
        .then(eleve => {

            // trouver la classe de l'élève
            ClasseDEcole.findOne({ _id: eleve.classe_d_ecole })
                .then(classe => {

                    // supprimer l'id de l'élève dans la classe
                    classe.eleves.splice(classe.eleves.indexOf(eleve._id),1);

                    // modifier la classe
                    ClasseDEcole.updateOne({ _id: classe._id }, classe)
                        .then(() => {

                            // supprimer les informations de l'élève
                            Eleve.deleteOne({ _id: request.params.id })
                                .then(() => response.status(200).json({ message: 'Objet supprimé !'}))
                                .catch(error => response.status(400).json({ error }))
                            ;
                        })
                    ;

                })
                .catch(error => response.status(500).json({ error }))
            ;
        })
        .catch(error => response.status(500).json({ error }))
    ;
}


exports.getAllEleve = async (request, response, next) => {

    await Eleve.find()
        .populate('classe_d_ecole')
        .then(eleve => response.status(200).json(eleve))
        .catch(error => response.status(400).json({ error }))
    ;
}