## Observez les données avec RxJS

`Pour réagir à des événements ou à des données de manière asynchrone`
Il y a le système de callback, par exemple, ou encore les Promise.  
`Avec l'API RxJS`, fourni et très intégré dans Angular, `la méthode proposée est celle des Observables`.

## Observables 

`Un Observable est un objet qui émet des informations auxquelles on souhaite réagir.`
Ces informations peuvent venir d'un champ de texte dans lequel l'utilisateur rentre des données, 
ou de la progression d'un chargement de fichier ou elles peuvent également venir de la communication avec un serveur
`Les Observables sont mis à disposition par RxJS, un package tiers qui est fourni avec Angular.`

`À cet Observable, on associe un Observer` — 
c'est un bloc de code qui sera exécuté à chaque fois que l'Observable émet une information.  
`L'Observable émet trois types d'information : des données, une erreur, ou un message complete`.  
Du coup, `tout Observer peut avoir trois fonctions : une pour réagir à chaque type d'information.`

Pour avoir accès aux Observables et aux méthodes qu'on veut utiliser, 
il faut ajouter deux imports :

    import { Observable } from 'rxjs/Observable';
    import 'rxjs/add/observable/interval';

`Le premier import` sert à rendre disponible le type Observable, 
et le deuxième donne accès à la méthode qu'on va utiliser : la méthode  interval() , 
qui crée un Observable qui émet un chiffre croissant à intervalles réguliers et qui prend le nombre de millisecondes souhaité pour l'intervalle comme argument. 
aller sur le site https://rxjs-dev.firebaseapp.com/api/index/function/interval

exemple : 

    import { Component, OnInit } from '@angular/core';
    import { Observable } from 'rxjs/Observable';
    import 'rxjs/add/observable/interval';

    @Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss']
    })
    export class AppComponent implements OnInit {

        ngOnInit() {
            `const counter = Observable.interval(1000);`
        }
    }

`On va observer` cet observable `avec la fonction subscribe()`
`qui prendra comme arguments entre 1 et 3 fonctions anonymes` pour gérer les trois 
types d'informations que cet Observable peut envoyer : des données, une erreur ou un message complete

exemple : On cré une variable  secondes  dans  AppComponent  et on affiche dans le template :

    < ul class="nav navbar-nav">
    < /ul>
    < div class="navbar-right">
        < p>Vous êtes connecté depuis `{{ secondes }}` secondes !</ p>
    </ div>


Dans ngOnInit() , on met les 3 fonctions que renvoie l'observable :
des données, une erreur ou un message complete
Dans le cas actuel, l'Observable qu'on crée ne rendra pas d'erreur et ne se complétera pas. c'est juste un exemple

    ngOnInit() {
        const counter = Observable.interval(1000);

        counter.subscribe(

        (value : number) => {
            this.secondes = value;
        },
        
        (error) => {
            console.log('Uh-oh, an error occurred! : ' + error);
        },

        () => {
            console.log('Observable complete!');
        }

        );
    }


## Subscriptions

Pour rappel, la fonction  subscribe()  prend comme arguments trois fonctions anonymes :
.
    - la première se déclenche à chaque fois que l'Observable émet de nouvelles données, et `reçoit ces données comme argument` ;
.
    - la deuxième se déclenche si l'Observable émet une erreur, et `reçoit cette     erreur comme argument` ;
.
    - la troisième se déclenche si l'Observable s'achève, et ne `reçoit pas d'argument`.


une souscription à un `Observable qui continue à l'infini` continuera à recevoir les données, 
que l'on s'en serve ou non, et `vous pouvez en subir des comportements inattendus`.


`Ce n'est pas le cas pour tous les Observables. Généralement, les souscriptions aux` 
Observables fournis par Angular se suppriment toutes seules lors de la destruction du component.


`Afin d'éviter tout problème, quand vous utilisez des Observables personnalisés`, 
il est vivement conseillé de `stocker la souscription dans un objet Subscription` (à importer depuis `rxjs/Subscription`) :

`on implémente OnDestroy` qui s'import depuis @angular/core avec sa fonction  
`ngOnDestroy()  qui se déclenche quand un component est détruit` :

exemple :

    import { Component, OnDestroy, OnInit } from '@angular/core';
    import { Observable } from 'rxjs/Observable';
    import 'rxjs/add/observable/interval';
    import { Subscription } from 'rxjs/Subscription';

    // component de base
    @Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss']
    })
    export class AppComponent implements OnInit, OnDestroy
    {

        secondes: number;
        counterSubscription: Subscription;


        ngOnInit(){
            const counter = Observable.interval(1000);

            this.counterSubscription = counter.subscribe(
                (value) => {
                    this.secondes = value;
                },

                (error) => {
                    console.log('ERREUR : ' + error);
                    
                },

                () => {
                    console.log('Observable complete !');
                }
            );
        }

        ngOnDestroy()
        {
            this.counterSubscription.unsubscribe();
        }
    }

La fonction  `unsubscribe()  détruit la souscription` et empêche les comportements inattendus liés aux Observables infinis, donc n'oubliez pas de unsubscribe !



## Subjects

`Il existe un type d'Observable qui permet non seulement de réagir à de nouvelles informations, mais également d'en émettre.`

Imaginez une variable dans un service, par exemple, `qui peut être modifié depuis plusieurs components` ET qui fera `réagir tous les components` qui y sont liés en même temps.  `Voici l'intérêt des Subjects`.

plusieurs étapes à faire : 

    - rendre private l'array des appareils, dans AppareilService

    - créer un Subject dans le service, dans AppareilService

    - créer une méthode (exemple : emitAppareilSubject() )  dans AppareilService
        qui réagit lorsque le service reçoit de nouvelles données, 
        puis qui émet ces données par le Subject et 
        qui appele cette méthode dans toutes les méthodes qui en ont besoin ;

    - souscrire à ce Subject  pour recevoir les données émises, dans AppareilViewComponent
        qui émet les premières données, 
        et qui implémente  OnDestroy  pour détruire la souscription.

exemple 

dans AppareilService

    import { Injectable } from '@angular/core';
    import { Subject } from 'rxjs/Subject';

    @Injectable({
        providedIn: 'root'
    })
    export class AppareilService {

        appareilsSubject = new Subject <any[]> ();

        private appareils = [
            {
                id: 1,
                name : 'télévision',
                status : 'éteint'
            },
            {
                id: 2,
                name : 'ordinateur',
                status : 'allumé'
            },
            {
                id: 3,
                name : 'radio',
                status : 'en panne'
            }
        ];

        constructor() { }

        emitAppareilSubject()
        {
            this.appareilsSubject.next(this.appareils.slice());
        }
    }



dans AppareilViewComponent 

    import { Component, OnInit, Input, OnDestroy } from '@angular/core';
    import { Subscription } from 'rxjs/Subscription';
    import { AppareilService } from '../services/appareil/appareil.service';

    @Component({
        selector: 'app-appareil-view',
        templateUrl: './appareil-view.component.html',
        styleUrls: ['./appareil-view.component.scss']
    })
    export class AppareilViewComponent implements OnInit, OnDestroy {

        title = 'angularOCR ;-)';

        isAuth = false;

        appareils: any[];
        appareilSubscription: Subscription;

        
        @Input() id: number;

    /**
    * on va faire une Promise pour imiter un serveur afin de
    * pouvoir utiliser le Pipe async
    */
    lastUpdate = new Promise((resolve, reject) => {

        const date = new Date();

        //affiche la date après 2 secondes
        setTimeout(() => {
        resolve(date);
        }, 2000);
        
    });

    appareilOne = 'machine à laver';
    appareilTwo = 'frigo';
    appareilThree = 'lave linge';
    appareilFour = 'micro onde';

    // exo, tableau de posts
    posts = [
        {
        title: 'post 1',
        content: 'mon premier post mon premier post mon premier post mon premier post mon premier post mon premier post',
        loveIts: '5' ,
        iLove: '90',
        iDontLove: '85',
        created_at: new Date()
        },
        {
        title: 'post 2',
        content: 'mon deuxième post mon deuxième post  mon deuxième post mon deuxième post mon deuxième post mon deuxième post mon deuxième post mon deuxième post',
        loveIts: '-10',
        iLove: '50',
        iDontLove: '60',
        created_at: new Date()
        },
        {
        title: 'post 3',
        content: 'mon troisième post mon troisième post mon troisième post mon troisième post mon troisième post mon troisième post mon troisième post mon troisième post',
        loveIts: '0',
        iLove: '0',
        iDontLove: '0',
        created_at: new Date()
        }
    ];


        constructor(private appareilService : AppareilService)
        {
            setTimeout( 
                () => { 
                    this.isAuth = true ; // permet à la variable isAuth de passer à true dans 4 secondes
                } , 4000
            );
        }

        ngOnInit(){
            this.appareilSubscription = this.appareilService.appareilsSubject.subscribe(

                (appareils: any[] ) => {
                    this.appareils = appareils;
                }
            );
            this.appareilService.emitAppareilSubject();
        }

        ngOnDestroy()
        {
            this.appareilSubscription.unsubscribe();
        }



## Opérateur

`Un opérateur est une fonction qui se place entre l'Observable et l'Observer` (la Subscription, par exemple), 
et qui peut filtrer et/ou modifier les données reçues avant même qu'elles n'arrivent à la Subscription.  

Voici quelques exemples rapides :

    - map()  : modifie les valeurs reçues — 
        peut effectuer des calculs sur des chiffres, 
        transformer du texte, 
        créer des objets…

    - filter()  :  filtre les valeurs reçues selon la fonction qu'on lui passe en argument.

    - throttleTime()  : impose un délai minimum entre deux valeurs — par exemple, 
        si un Observable émet cinq valeurs par seconde, mais ce sont uniquement les valeurs reçues toutes les secondes qui vous intéressent, 
        vous pouvez passer  throttleTime(1000)  comme opérateur.

    - scan()  et  reduce()  : permettent d'exécuter une fonction qui réunit 
        l'ensemble des valeurs reçues selon une fonction que vous lui passez — par exemple, 
            vous pouvez faire la somme de toutes les valeurs reçues.    
        La différence basique entre les deux opérateurs :   
            reduce()  vous retourne uniquement la valeur finale, 
            alors que  scan()  retourne chaque étape du calcul.