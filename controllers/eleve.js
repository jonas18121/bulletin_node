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
    console.log(request.body);

    await eleve.save()
        .then(() => ClasseDEcole.findOne({ _id: eleve.classe_d_ecole })
            .then(classe => {

                classe.eleves.push(eleve);

                ClasseDEcole.updateOne({_id: classe.id}, classe)
                    .then(() => response.status(201).json({ message: 'Objet enregistré !'}))
                    .catch(error => response.status(400).json({ error }))
            })
        )
        .catch(error => response.status(400).json({ error }))
    ;
}



exports.getOneEleve = async (request, response, next) => {

    await Eleve.findOne({ _id: request.params.id })
        .populate('classe_d_ecole')
        .then(eleve => response.status(200).json(eleve))
        .catch(error => response.status(404).json({ error }));
}


exports.modifyEleve = async (request, response, next) => {

    await Eleve.findOne({ _id: request.params.id })
        .populate('classe_d_ecole')
        .then(eleve => {

            //si il y a un changement de classe lors de la modification de l'élève 
            if (eleve.classe_d_ecole._id != request.body.classe_d_ecole) {
                
                // trouve l'ancienne classe de l'élève
                ClasseDEcole.findOne({ _id: eleve.classe_d_ecole._id })
                    .then(oldClasse => {

                        // supprimer l'id de l'élève dans l'ancienne classe
                        oldClasse.eleves.splice(oldClasse.eleves.indexOf(eleve._id),1);

                        // console.log('ancienne classe ' + oldClasse);

                        //modifier l'ancienne classe de l'élève
                        ClasseDEcole.updateOne({ _id: eleve.classe_d_ecole._id }, oldClasse)
                            .then(()=> {

                                // trouve la nouvelle classe de l'élève
                                ClasseDEcole.findOne({ _id: request.body.classe_d_ecole })
                                .then(newClasse => {

                                    // console.log('nouvelle classe ' + newClasse);

                                    // ajouter l'élève dans sa nouvelle classe
                                    newClasse.eleves.push(eleve);
                                    
                                    //modifier la nouvelle classe
                                    ClasseDEcole.updateOne({ _id: request.body.classe_d_ecole }, newClasse)
                                        .then(() => {

                                            // modifier l'élève
                                            Eleve.updateOne({ _id: request.params.id }, { ...request.body, _id: request.params.id })
                                                .then(() => response.status(200).json({ message: 'L\'élève a été bien mis dans sa nouvelle classe'}))
                                                .catch(error => response.status(400).json({ error }))
                                            ;
                                        })
                                        .catch(error => response.status(400).json({ error }))
                                    ;
                                    })
                                    .catch(error => response.status(400).json({ error }))
                                ;
                            })
                            .catch(error => response.status(400).json({ error }))
                        ;
                    })
                    .catch(error => response.status(400).json({ error }))
                ;
            }
            else{

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
    
    await Eleve.deleteOne({ _id: request.params.id })
        .then(() => response.status(200).json({ message: 'Objet supprimé !'}))
        .catch(error => response.status(400).json({ error }));
}


exports.getAllEleve = async (request, response, next) => {

    await Eleve.find()
        .then(eleve => response.status(200).json(eleve))
        .catch(error => response.status(400).json({ error }));
}