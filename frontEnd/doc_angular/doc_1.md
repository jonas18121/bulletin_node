
`Le dossier e2e sert pour faire du tests end-to-end`

Le dossier  `node_modules`  contient toutes les dépendances pour votre application : les fichiers source Angular et TypeScript, par exemple.


//////////////////////////////////////////

`dans un fichier xxx.component.ts :`

    import { Component } from '@angular/core';

    @Component({
      selector: 'app-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.scss']
    })
    export class AppComponent {
      title = 'app';
    }

    - selector = le nom qu'on utilisera comme balise HTML pour afficher ce component, comme avec <app-root>

    - templateUrl  : le chemin vers le code HTML à injecter 

    - styleUrls  : un array contenant un ou plusieurs chemins vers les feuilles de styles qui concernent ce component

    Quand Angular rencontre la balise <app-root> dans le document HTML, il sait qu'il doit en remplacer le contenu par celui du 
    template app.component.html, en appliquant les styles app.component.scss, le tout géré par la logique du fichier app.component.ts 



    //////////////////////////////////////////////////////////

## Debuguer dans le html de Angular

    <pre>
        <!-- pour debug dans html angular -->
        <span>{{eleve | json}}</span>
    </pre>


## déclaration de variable

  dans fichier xxx.component.ts , on declare une variable dans la class exemple, `nomDeVariable : string = 'valeur de la variable';`

  dans fichier xxx.component.html , on affiche une variable avec les accolades exemple `{{ nomDeVariable }}`


## déclaration de function

  dans fichier xxx.component.ts , on declare une function dans la class exemple :
      getFunction()
      {
        return this.nomDeVariable;
      }

  dans fichier xxx.component.html , on affiche une getFunction() avec les accolades exemple `{{ getFunction() }}`


## Property binding

`La liaison par propriété ou "property binding"` est une autre façon de créer de la `communication dynamique depuis le fichier TypeScript vers le fichier template` 

exemple :

  `on lie la propriété` disabled qui est dans le `fichier app.component.html`, `à la variable` isAuth `qui est dans le fichier app.component.ts grace au crochets` -> [disabled], ce qui `permet a la variable` isAuth `d'influencer sur la propriété` disabled :
  
  `<button [disabled]="!isAuth">Tout allumer</button>`


## Event binding

`Event binding"` est une façon de permettre à un` code TypeScript de réagir à un évènnement venant du code html ` 
on `utilise` les `parenthèses  ()`  pour `créer une liaison à un événement`

exemple : 

  < button (click)='onAllume()'>Tout allumer</ button>


## Two-way binding

La `liaison à double sens (ou two-way binding)` utilise la `liaison par propriété et la liaison par événement en même temps` ; on l'utilise, par exemple, pour les formulaires, afin de pouvoir `déclarer et de récupérer le contenu des champs`, entre autres.

Pour pouvoir utiliser le two-way binding, il vous faut importer  `FormsModule  depuis  @angular/forms`  dans votre application dans AppModule.ts

exemple :

    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';


    import { AppComponent } from './app.component';
    import { MonPremierComponent } from './mon-premier/mon-premier.component';
    import { AppareilComponent } from './appareil/appareil.component';
    import { FormsModule } from '@angular/forms';


    @NgModule({
      declarations: [
        AppComponent,
        MonPremierComponent,
        AppareilComponent
      ],
      imports: [
        BrowserModule,
        FormsModule
      ],
      providers: [],
      bootstrap: [AppComponent]
    })
    export class AppModule { }



Le two-way binding emploie le `mélange` des `syntaxes de property binding et d'event binding` : des crochets et des parenthèses  `[()]`

exemple :
  < input type="text" [(ngModel)]='appareilName'>



## Propriétés personnalisées

il est possible de `créer des propriétés personnalisées` dans un component afin de pouvoir lui transmettre des données depuis l'extérieur

On uitlise le décorateur `@Input()` et on importe `Input` dans le `from '@angular/core'` du xxx.component.ts qu'on veut dynamiser ses variables

exemple
    import { Component, Input, OnInit } from '@angular/core';

    @Component({
      selector: 'app-appareil',
      templateUrl: './appareil.component.html',
      styleUrls: ['./appareil.component.scss']
    })
    export class AppareilComponent implements OnInit {

      @Input() appareilName: string;
      
      appareilStatus: string = 'éteint';

      constructor() { }

      ngOnInit() {
      }

      getStatus() {
        return this.appareilStatus;
      }

    }


dans le xxx.component.html on peut < app-appareil appareilName="appareilOne"></ app-appareil>

dans app.component.ts 

    export class AppComponent {
      isAuth = false;
      
      appareilOne = 'Machine à laver';
      appareilTwo = 'Frigo';
      appareilThree = 'Ordinateur';

      constructor() {

`si vous employez les crochets pour le property binding et que vous souhaitez y passer un string directement, il faut le mettre entre apostrophes, car entre les guillemets, sinon le framwork va croire que vous voulez mettre des variables, alors que vous voulez mettre des string ficelle :) `


## Directives

#### N'oubliez pas l'astérisque devant ces directives, qui signifie à Angular de les traiter comme directives structurelles !

Les `directives` sont des `instructions intégrées dans le DOM`.  Quand Angular lit votre template et rencontre une directive qu'il reconnait, il suit les instructions correspondantes.

Il existe `deux types` principaux `de directive` : les `directives structurelles` et les `directives par attribut`.


### Directives structurelles

Ce sont des directives qui, `modifient la structure du document`. 


#### Directives structurelles *ngIf 

`*ngIf`, pour afficher des données de façon conditionnelle.

un peut comme pour la condition `if()`, la directive `*ngIf="condition"`, s'affichera seulement si la condition est `truthy`, `truthy = true pour la condition if()`

exemple : 
  Pour une démonstration simple, ajoutez une  < d i v >  rouge qui ne s'affichera que si l'appareil est éteint :
  
  
    <div style="width:20px;height:20px;background-color:red;" *ngIf="appareilStatus === 'éteint'"></div>



  démonstration `*ngIf avec then et esle`

  Si la variable appareilStatus est égale à 'éteint', on va affiché le contenu du `ng-template qui a le hastag red` #red
  sinon, on va affiché le contenu du `ng-template qui a le hastag green` #green
  
  .
    
    <div *ngIf="appareilStatus === 'éteint'; then red; else green" ></div>
  .
  
    <ng-template #red>
        <div style="width:20px;height:20px;background-color:red;"></div>
    </ng-template>


  Maintenant, si la variable appareilStatus est égale à 'allumé', le contenu du `ng-template qui a le hastag green` #green s'affichera lui méme
  sinon, on va affiché le contenu du `ng-template qui a le hastag gray` #gray

  .
    
    <ng-template #green>
        <div style="width:20px;height:20px;background-color:green;" *ngIf="appareilStatus === 'allumé'; else gray"></div>
    </ng-template>
	
  .
  
    <ng-template #gray>
        <div style="width:20px;height:20px;background-color:rgb(100, 104, 100);"></div>
    </ng-template>


#### Directives structurelles *ngFor 

`*ngFor` , pour itérer des données dans un array, par exemple

Lorsque l'on ajoute la directive  `*ngFor="let obj of myArray"`  à un component, `Angular itérera l'array  myArray  et affichera un component par objet  obj` .

pour lexemple on va créer un `tableau qui contiendra des objets qui représente des appareils` dans app.components.ts :  
    appareils = [
      {
        name: 'Machine à laver',
        status: 'éteint'
      },
      {
        name: 'Frigo',
        status: 'allumé'
      },
      {
        name: 'Ordinateur',
        status: 'éteint'
      }
    ];

et maintenant on va utiliser le ngFor dans app.component.html

    <app-appareil  *ngFor="let appareil of appareils"
                    [appareilName]="appareil.name"
                    [appareilStatus]="appareil.status"
    ></app-appareil>



### Directives par attribut

les directives par attribut `modifient le comportement d'un objet déjà existant`. la directive  ngModel  que vous avez employée pour le two-way binding, qui modifie la valeur du  <input>  et répond à tout changement qu'on lui apporte.


#### Directives par attribut ngStyle

Cette directive permet d'`appliquer des styles` à un objet du DOM de manière `dynamique`.
`ngStyle`  prend un objet JS de type `clé-valeur`, avec comme `clé le style à modifier`, et comme `valeur, la valeur souhaitée pour ce style`.

exemple dans appareil.component.html

    <h4 [ngStyle]="{color: getColor()}">Appareil : {{ appareilName }} -- Statut : {{ getStatus() }}</h4>

et dans appareil.component.ts

    getColor() {
      if(this.appareilStatus === 'allumé') {
        return 'green';
      } else if(this.appareilStatus === 'éteint') {
        return 'red';
      }
    }


#### Directives par attribut ngClass

Au-delà de modifier des styles directement, il peut être très utile d'`ajouter des classes CSS à un élément de manière dynamique`.  Comme  ngStyle ,  `ngClass`  prend un `objet clé-valeur`, mais cette fois avec la `classe à appliquer en clé, et la condition en valeur`.

Que ce soit pour  `ngStyle  ou pour  ngClass` , les objets JS peuvent être des `variables valables dans votre TypeScript` qui seront ensuite `référencées par la directive`, par exemple :  [ngClass]="myClassObject"

exemple :

    < l i [ngClass]="{
      'list-group-item' : true,
      'list-group-item-success' : appareilStatus === 'allumé',
      'list-group-item-danger' : appareilStatus === 'éteint'
    }">une liste< l i >




## Pipe

Les `pipes` (/pʌɪp/) prennent des `données en input`, les `transforment`, et puis `affichent les données modifiées dans le DOM`. 

#### DatePipe

`DatePipe` analyse des objets JS de type Date et qui les affiche d'une manière plus lisible que leur encodage de base

exemple :

  dans app.component.ts :
    export class AppComponent {
      lastUpdate = new Date();
    }

  puis dans app.component.html :
    < p >Mis à jour : {{ lastUpdate | date: 'short' }}< / p >


##### Pour mettre la date en français

version inférieur a angular 5 :
dans `app.module.ts` mettre 

    import { LOCALE_ID } from '@angular/core';

puis mettre `{  provide: LOCALE_ID,useValue: 'fr'}` dans providers[] toujours dans `app.module.ts`

    providers: [
      {
        provide: LOCALE_ID, 
        useValue: 'fr'
      }
    ]

et enfin rajouter le 'fr' dans fichier html
    < p >Mis à jour : {{ lastUpdate | date: 'full' : 'fr' }}< / p >


##### En chainé les Pipes

On avoir besoin de plusieurs pipes pour un seul élément du DOM.

        <p>Mis à jour : {{ lastUpdate | date: 'full' : 'fr' | uppercase }}</p>

`Attention : L'ordre des pipes est important. sinon ça peut ne pas fonctionner`


#### AsyncPipe

Le pipe `async` permet de `gérer des données asynchrones`, par exemple `des données` que l'application doit `récupérer sur un serveur`

exemple :
on va simuler le comportement d'un serveur en créant une Promise qui va se résoudre au bout de quelques secondes.

dans `app.component.ts` :

    lastUpdate = new Promise((resolve, reject) => {
      const date = new Date();

      setTimeout(
        () => {
          resolve(date);
        }, 2000
      );

    });

puis dans `app.component.html` :

    < p >Mis à jour : {{ lastUpdate | async | date: 'yMMMMEEEEd' | uppercase }}< / p >

`Maintenant`, quand la page recharge, `le champ` "Mis à jour" est vide et puis, au bout de deux secondes, `les données retournées par la Promise sont reçues, modifiées par les pipes suivants, et affichées.`