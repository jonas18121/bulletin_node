## Service

un `service permet de centraliser des parties de votre code et des données` qui sont utilisées par plusieurs parties de votre application ou
`de manière globale par l'application entière.` 

Les services permettent : 

   - `de ne pas avoir le même code doublé ou triplé à différents niveaux de l'application` - ça facilite donc la maintenance, la lisibilité et la stabilité du code .

   - `de ne pas copier inutilement des données` - si tout est centralisé, `chaque partie de l'application aura accès aux mêmes informations,` 
   `évitant beaucoup d'erreurs potentielles`.


### Injection et instances de services

Pour être utilisé dans l'application, `un service doit être injecté`, et `le niveau choisi pour l'injection est très important`.  
Il y a `trois niveaux possibles pour cette injection` :

   - 1 - `dans  AppModule`  : ainsi, `la même instance du service` sera utilisée par `tous les components de l'application et par les autres services` ;

   - 2 - `dans  AppComponent`  : comme ci-dessus, `tous les components` auront accès à `la même instance du service` mais ` les autres services n'auront pas accès à ce service ` ;

   - 3 - `dans un autre component` : le `component lui-même et tous ses enfants`
    (c'est-à-dire tous les components qu'il englobe) auront accès à la même instance du service, `mais le reste de l'application n'y aura pas accès`.

exemples :

on crée un `sous-dossier services` dans le dossier `app/` ,et on crée un nouveau fichier appelé `appareil.services.ts`, puis on ecrit ça dedans :
    
`PS :`si on crée le services directement en ligne commande, ça sera déjà créer

    export class AppareilService {
  
    }

on va injecter `le service AppareilService` dans AppModule , d'abord en `l'important` :

    import { AppareilService } from './services/appareil/appareil.service';

puis en le mettant dans le `providers de appModule`, afin que ce `service soit utilisé`, 
à la fois `dans tous les components` et `dans tous les autres services aussi` dans toutes l'application

    providers: [
        {
        provide: LOCALE_ID, 
        useValue: 'fr'
        },
        AppareilService
    ]

#### intégrer un services dans un component 

Pour intégrer un service `dans un component, on déclare le service comme argument dans le constructeur du component`.
avec l'import qui convient

exemple : dans le component AppComponent :

    
    import { AppareilService } from './services/appareil/appareil.service';

    constructor(private appareilService: AppareilService) {
        setTimeout(
        () => {
            this.isAuth = true;
        }, 4000
        );
    }

##### ngOnInit()

`ngOnInit()  correspond à une "lifecycle hook"`, 
la méthode  ngOnInit()  d'un component est exécutée une fois par instance,
`au moment de la création du component par Angular, et après son constructeur.` 
On l'utilise très souvent pour initialiser des données une fois le component créé

`Il faut importé OnInit dans le component précis et l'implémenté dans la classe en question pour utiliser ngOnInit() `: 

    import { Component, OnInit } from '@angular/core';
    import { AppareilService } from './services/appareil.service';

    @Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
    })
    export class AppComponent implements OnInit {

        constructor(private appareilService : AppareilService){}

        ngOnInit() {
            this.appareils = this.appareilService.appareils;
        }
    }


##### Faire communiquer les components enfants et leur parent et un services

Dans un premier temps, il faudra que chaque instance du xxx.component.ts  
puisse dire au service  xxx.Service.ts à quel index de l'array elle correspond dans une base de donnée par exemple.
on fait ça *ngFor 

exemple :

    < app-appareil  `*ngFor=`"let appareil of appareils; `let i = index`"
                   [ appareilName]="appareil.name"
                   [ appareilStatus]="appareil.status"></ app-appareil>


puis pour travailler avec la variable `index` on va utiliser le property binding dans
le xxx.component.ts correspondant :

    @Input() index: number;

puis `on lie l'index i depuis le template xxx.component.html` correspondant

exemple : 

    < app-appareil  *ngFor="let appareil of appareils; let i = index"
                   [ appareilName]="appareil.name"
                   [ appareilStatus]="appareil.status" 
                   `[ index]="i"`></ app-appareil>

À partir de là, `on a une variable  index  disponible à l'intérieur du component qui correspond à l'index de l'appareil dans l'array du service  xxx.Service.ts`

Dans  AppareilService , on créer les méthodes permettant d'allumer ou d'éteindre un seul appareil `en fonction de son index dans l'array  appareils`  :

    switchOnOne(i: number) {
        this.appareils[i].status = 'allumé';
    }

    switchOffOne(i: number) {
        this.appareils[i].status = 'éteint';
    }


Ensuite, dans  xxx.component.ts , vous allez d'abord intégrer le service  xxx.Service.ts, en l'important en haut du fichier comme toujours :

exemple:
    `constructor(private appareilService: AppareilService) { }`

Puis vous allez préparer la méthode qui, en fonction du statut actuel de l'appareil, l'allumera ou l'éteindra :


    onSwitch() {
        if(this.appareilStatus === 'allumé') {
            this.appareilService.switchOffOne(this.index);
        } else if(this.appareilStatus === 'éteint') {
            this.appareilService.switchOnOne(this.index);
        }
    }


Enfin, vous allez créer le bouton dans le template qui déclenchera cette méthode.  Il serait intéressant que ce bouton soit contextuel : si l'appareil est allumé, il affichera "Éteindre" et inversement.  Pour cela, le plus simple est de créer deux boutons dotés de la directive  *ngIf  : 

exemple : 
    < button class="btn btn-sm btn-success"
          *ngIf="appareilStatus === 'éteint'"
          (click)="onSwitch()">Allumer</ button>

    < button class="btn btn-sm btn-danger"
          *ngIf="appareilStatus === 'allumé'"
          (click)="onSwitch()">Eteindre</ button>

Et voilà !  Vos components communiquent entre eux à l'aide du service,