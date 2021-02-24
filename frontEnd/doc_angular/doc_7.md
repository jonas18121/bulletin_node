# Interagissez avec un serveur avec HttpClient

Dans une application Angular, 
vous aurez très souvent besoin de faire des appels à un backend ou à un autre serveur — 
pour enregistrer ou charger des données, par exemple, 
ou pour effectuer des calculs ou des modifications de données que vous ne souhaitez pas faire faire par le frontend.  
`Angular met à disposition un service appelé HttpClient qui permet de créer et d'exécuter des appels HTTP` 
(fait par AJAX - Asynchronous JavaScript and XML) 
et de réagir aux informations retournées par le serveur.

Dans ce chapitre, on va configurer un backend avec le service Firebase de Google.  
Ce service permet la création d'un backend complet sans coder, 
et node comprend énormément de services, dont l'authentification, 
une base de données NoSQL et un stockage de fichiers.

## Préparer le Backend

Rendez-vous sur le site `firebase.com`, on crée un compte Google ou on s'authentifie si on en a déjà un, 
et `on click sur Accéder à la console pour créer un nouveau projet Firebase`.  
On peut le domicilier dans notre pays de résidence et lui donner le nom qu'on veut.


Une fois arrivé sur la console, `on va dans Database et on choisis le Realtime Database.`

avant de 2020 : ------------------------------------------------------------------------------
Afin d'éviter tout problème d'authentification pour l'instant, 
On va `dans la section "Règles"` et on `définis  read  et  write  en  true` , 
puis on publie les règles modifiées 

------------------------------------------------------------------------------------------------

a partir de 2020 : ---------------------------------------------------------------------------------
`puis crée une base de donnée et on coche la case test pour avoir accès tout public pour l'instant`
et on prent l'url qu'il faut
pour moi c'est ça : https://httpclient-demo-50294-default-rtdb.europe-west1.firebasedatabase.app/

-----------------------------------------------------------------------------------------------------

Puis `on revient à la section Données et on note l'URL de notre base de données, `
On va en avoir besoin pour configurer les appels HTTP .


## Envoyer vers le backend

Pour avoir accès au service HttpClient , il faut tout d'abord ajouter `HttpClientModule` , 
`importé depuis  @angular/common/http , à notre  AppModule`  


exemple dans app.modules.ts :

    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes)
    ],


On va utiliser `HttpClient`, dans un premier temps, 
`pour la gestion des données de la liste d'appareils.`  
On va l'injecter `dans AppareilService` , 
en y ayant auparavant `ajouté le décorateur @Injectable() (importé depuis  @angular/core  )` .


On va aussi créer une méthode (saveAppareilsToServer()) qui va enregistrer l'array appareils dans la base de données au endpoint  /appareils par la méthode POST , 


dans appareil.services.ts

    import { Subject } from 'rxjs/Subject';
    import { Injectable } from '@angular/core';
    import { HttpClient } from '@angular/common/http';

    @Injectable()
    export class AppareilService {

    appareilsSubject = new Subject<any[]>();

    private appareils = [
        {
        id: 1,
        name: 'Machine à laver',
        status: 'éteint'
        },
        {
        id: 2,
        name: 'Frigo',
        status: 'allumé'
        },
        {
        id: 3,
        name: 'Ordinateur',
        status: 'éteint'
        }
    ];
    
    constructor(private httpClient: HttpClient) { }

    saveAppareilsToServer() {
        this.httpClient
        .post('https://httpclient-demo-50294-default-rtdb.europe-west1.firebasedatabase.app/appareils.json', this.appareils)
        .subscribe(
            () => {
            console.log('Enregistrement terminé !');
            },
            (error) => {
            console.log('Erreur ! : ' + error);
            }
        );
    }



`On va analyser la méthode saveAppareilsToServer()`

la méthode  `post() , qui permet de lancer un appel POST`, 
prend comme premier argument l'URL visée, et comme deuxième argument le corps de l'appel, c'est-à-dire ce qu'il faut envoyer à l'URL ;

`l'extension  .json  de l'URL est une spécificité Firebase`, pour lui dire que vous lui envoyez des données au format JSON ;

la méthode  `post()  retourne un Observable — elle ne fait pas d'appel à elle toute seule`.  C'est en y souscrivant que l'appel est lancé ;

dans la méthode  `subscribe() , prévoi le cas où tout fonctionne et le cas où le serveur vous renverrait une erreur.`



On crée maintenant un bouton dans appareil-view.component.html qui déclenche cette sauvegarde.

dans `appareil-view.component.html`

    <button class="btn btn-success"
        (click)="onAllumer()">Tout allumer</button>
    <button class="btn btn-danger"
            (click)="onEteindre()">Tout éteindre</button>
    <button class="btn btn-primary"
            (click)="onSave()">Enregistrer les appareils</button>


dans `appareil-view.component.ts`

    onSave() {
        this.appareilService.saveAppareilsToServer();
    }



on Enregistre le tout, et on clique sur le bouton qu'on vient de créer : 
on devrait avoir notre message de réussite qui apparait dans la console.  
Si on regarde maintenant la console Firebase on aura des chose:


Firebase a créé un nouveau node sous  appareils  avec un identifiant unique, et a enregistré notre array  appareils


Cependant, si on clique plusieurs fois sur ce bouton, Firebase continuera à créer de nouveaux nodes,
 et dans ce cas de figure, ce n'est pas le comportement souhaité. 
 Il faudrait que chaque enregistrement écrase le précédent : 
 pour cela, on va utilisé plutôt la méthode put() (il n'y a pas besoin de changer les arguments,
car les méthodes put() et post() prennent les deux mêmes premiers arguments) :

    saveAppareilsToServer() {
        this.httpClient
        .put('https://httpclient-demo.firebaseio.com/appareils.json', this.appareils)
        .subscribe(
            () => {
            console.log('Enregistrement terminé !');
            },
            (error) => {
            console.log('Erreur ! : ' + error);
            }
        );
    }

Maintenant, quand on enregistre les données, ça fait du bien.


## Recevoir depuis le backend

Afin de demander la liste des appareils (maintenant stocké au endpoint  /appareils ), 
`on va créer une nouvelle méthode qui emploie la méthode get() dans AppareilService`

exemple dans `appareil.service.ts`

    getAppareilsFromServer() {
        this.httpClient
        .get<any[]>('https://httpclient-demo.firebaseio.com/appareils.json')
        .subscribe(
            (response) => {
            this.appareils = response;
            this.emitAppareilSubject();
            },
            (error) => {
            console.log('Erreur ! : ' + error);
            }
        );
    }


Comme pour post() et put() , la méthode `get() retourne un Observable`, 
mais `puisqu'on va recevoir des données, TypeScript a besoin de savoir de quel type elles seront retourné` 
`(l'objet retourné est d'office considéré comme étant un Object). ` 
Dans ce cas précis,` on va ajouter <any[]> entre la methode .get et ses parenthèses,` 
pour dire qu'on va recevoir un array de type any , 
Comme ça TypeScript pourra traiter cet objet comme un array.
Si on ne le faites pas, TypeScript nous dira qu'un array ne peut pas être redéfini comme Object.

-------------------------------------------------------

On ajoute le bouton permettant de déclencher la méthode getAppareilsFromServer()
dans `appareil-view.component.html`

    <button class="btn btn-primary"
        (click)="onFetch()">Récupérer les appareils</button>

Et on ajoute la méthode onFetch() dans `appareil-view.component.ts`

    onFetch() {
        this.appareilService.getAppareilsFromServer();
    }

Maintenant, on peut ajouter de nouveaux appareils, en modifier l'état et les sauvegarder, 
puis récupérer la liste sauvegardée.


Il serait également possible de rendre automatique le chargement et l'enregistrement des appareils 
(par exemple en appelant la méthode  getAppareilsFromServer() dans ngOnInit(),et saveAppareilsToServer()  après chaque modification), 
mais j'ai souhaité laisser la possibilité de les exécuter manuellement afin de voir le résultat de manière plus concrète.

Dans ce chapitre, on a appris à passer des appels à un serveur HTTP avec le service HttpClient. 
On a utilisé un backend Firebase pour cette démonstration. 
En effet, Firebase propose une API beaucoup plus flexible que des appels HTTP simples afin de profiter pleinement des services proposés.