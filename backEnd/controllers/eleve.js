const Eleve = require('../models/eleve');
const mongoose = require('mongoose');
const { populate } = require('../models/eleve');
const ClasseDEcole = require('../models/classeDEcole');


// $set  = ajouter
// $pull = retirer
// $push = ajouter dans tableau


exports.createEleve = async (request, response, next) => {

    delete request.body._id;

    const eleve = new Eleve({
        _id: new mongoose.Types.ObjectId(),
        ...request.body,  
        moyenne: 0
    });

    const eleve_save = await eleve.save();

    if (!eleve_save) {
        return response.status(400).json({ message: 'L\'éleve n\'a pas été enregistrer et n\'existe pas' });
    }

    const classe = await ClasseDEcole.findOne({ _id: eleve_save.classe_d_ecole }).populate('eleves');

    if (!classe) {
        return response.status(400).json({ message: 'La classe n\'existe pas' });
    }

    classe.eleves.push(eleve);
    classe.nbEleves = classe.eleves.length;
    classe.moyenneClasse = calculMoyenneClasse(classe.nbEleves, classe.eleves);

    const modif_classe = await ClasseDEcole.updateOne({_id: classe.id}, classe);

    if (!modif_classe) {
        return response.status(400).json({ message: 'La classe n\'a pas pu être modifier ou la classe n\'existe pas' });
    } 

    return response.status(200).json({ message: 'La classe a été bien modifier après l\'ajout de l\'élève ' });
}



exports.getOneEleve = async (request, response, next) => {

    await Eleve.findOne({ _id: request.params.id })
        .populate('classe_d_ecole')
        .populate('devoir_eleves')
        .then(eleve => { response.status(200).json(eleve) })
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
                        

                        for(i = 0 ; i < oldClasse.nbEleves ; i++)
                        {
                            moyenneOldClasse = oldClasse.eleves[i].moyenne;

                            sommeOldClasse += moyenneOldClasse ;

                        };

                        oldClasse.moyenneClasse = sommeOldClasse / oldClasse.nbEleves;

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

                                        for(i = 0 ; i < newClasse.nbEleves ; i++)
                                        {
                                            moyenneNewClasse = newClasse.eleves[i].moyenne;

                                            sommeNewClasse += moyenneNewClasse ;
                                        };

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

    const eleve = await Eleve.findOneAndDelete({ _id: request.params.id });

    if (!eleve) {
        return response.status(400).json({ message: 'Pas d\'élève trouver avec cette id' });
    }

    const classe = await ClasseDEcole.findByIdAndUpdate( {  _id: eleve.classe_d_ecole }, { $pull: { eleves: eleve._id } } ).populate('eleves');

    if (!classe) {
        return response.status(400).json({ message: 'La classe n\'a pas pu être modifier ou la classe n\'existe pas' });
    }

    classe.nbEleves = classe.eleves.length;
    classe.moyenneClasse = calculMoyenneClasse(classe.nbEleves, classe.eleves);

    const modif_classe = await ClasseDEcole.updateOne({ _id: classe._id }, classe);

    if (!modif_classe) {
        return response.status(400).json({ message: 'La classe n\'a pas pu être modifier ou la classe n\'existe pas' });
    } 

    return response.status(200).json({ message: 'La classe a été bien modifier après la suppréssion de l\'élève ' });
}


exports.getAllEleve = async (request, response, next) => {

    await Eleve.find()
        .populate('classe_d_ecole')
        .then(eleve => response.status(200).json(eleve))
        .catch(error => response.status(400).json({ error }))
    ;
}



calculMoyenneClasse = (nbEleves, classe_eleves) => {

    var moyenneClasse;
    var sommeClasse = 0;

    if (nbEleves == 0) {
        return moyenneClasse = 0;
    }
    else{
        
        for(i = 0 ; i < nbEleves ; i++)
        {
            moyenneClasse = classe_eleves[i].moyenne;

            sommeClasse += moyenneClasse ;
        };

        return moyenneClasse = sommeClasse / nbEleves;
    }
}



















/* pour creer un eleve


await eleve.save()
        .then(() => ClasseDEcole.findOne({ _id: eleve.classe_d_ecole })
            .populate('eleves')
            .then(classe => {

                classe.eleves.push(eleve);

                classe.nbEleves = classe.eleves.length;
                classe.moyenneClasse = calculMoyenneClasse(classe.nbEleves, classe.eleves);

                ClasseDEcole.updateOne({_id: classe.id}, classe)
                    .then(() => {
                        response.status(201).json({ message: 'Le nouvel élève a bien été enregistré !' })
                    })
                    .catch(error => response.status(400).json({ error }))
                ;
            })
        )
        .catch(error => response.status(500).json({ error }))
    ; 
*/







/* pour supprimer un eleve 

await ClasseDEcole.findByIdAndUpdate(
        { 
            _id: eleve.classe_d_ecole 
        },
        {
            $pull:
                {
                    eleves: eleve._id
                }    
        }
    )
    .populate('eleves')
    .then(
        classe => {

            classe.nbEleves = classe.eleves.length;
            classe.moyenneClasse = calculMoyenneClasse(classe.nbEleves, classe.eleves);

            ClasseDEcole.updateOne({ _id: classe._id }, classe)
                .then(
                    () => {
                        response.status(200).json({ message: 'La classe a été bien modifier après la suppréssion de l\'élève ' });
                    }
                )
                .catch(error => response.status(400).json({ error }))
            ;
        }
    )
    .catch(error => response.status(400).json({ error })); 
*/