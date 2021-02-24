# Ecoutez l'utilisateur avec les Forms avec  La méthode réactive

À la différence de la méthode template où Angular crée l'objet du formulaire, pour `la méthode réactive`,
`on le crée nous-même et on le relier à notre template.`  
Même si cela a l'air plus complexe, `cela nous permet de gérer notre formulaire en détail,` 
notamment `avec la création programmatique de contrôles `
(permettant, par exemple, à l'utilisateur d'ajouter des champs).



pour l'exemple on va permettre aux utilisateurs de créer un profil utilisateur simple

on va `creér le modèle User`  ; 
on crée un nouveau `dossier  models` ,  et dedans un fichier  `User.model.ts` .

`Ce modèle pourra donc être utilisé dans le reste de l'application en l'important` dans les components où on à besoin.

`La syntaxe de son constructeur permet l'utilisation du mot-clé  new`, et les arguments passés seront 
attribués à des variables qui portent les noms choisis ici,

exemple :
`const user = new User('James', 'Smith', 'james@james.com', 'jus d\'orange', ['football', 'lecture'])`.
 
`ça créera un nouvel objet User avec ces valeurs attribuées aux variables` :

    - user.firstName ,  
    - user.lastName  
    - etc.

exemple dans `models/User.model.ts`

    export class User {
        constructor(
            public firstName: string,
            public lastName: string,
            public email: string,
            public drinkPreference: string,
            public hobbies?: string[]
        ) {}
    }

public hobbies?: string[] :
` Le point d'interrogation veut dire que c'est optionnel` 

` string[] veut dire que c'est un array de type string` 




Ensuite, `on crée un UserService simple qui stockera la liste des objets User` et qui comportera une `méthode permettant d'ajouter un utilisateur à la liste`

Ce service contient un array privé qui contiendra des objets de type User
et un Subject pour émettre cet array.

La méthode  `emitUsers()  déclenche ce Subject` et la méthode  `addUser()  ajoute un objet  User  à l'array`, 
puis déclenche le Subject.

`On ajoute UserServices à l'array providers dans AppModule !`

exmple dans `UserServices` :

    import { User } from '../models/User.model';
    import { Subject } from 'rxjs/Subject';

    export class UserService {
        private users: User[];
        userSubject = new Subject<User[]>();

        emitUsers() {
            this.userSubject.next(this.users.slice());
        }

        addUser(user: User) {
            this.users.push(user);
            this.emitUsers();
        }
    }

private users: User[]; ça veut dire que la variable users prend un tableau de type User

--------------------------------------------------------------------------------------------

L'étape suivante est de créer  `UserListComponent`

`UserListComponent` est souscrit au Subject dans UserService et le déclenche pour en récupérer les informations 
et les rendre disponibles au template

exemple dans `user-list.component.ts`: 

    import { Component, OnDestroy, OnInit } from '@angular/core';
    import { User } from '../models/User.model';
    import { Subscription } from 'rxjs/Subscription';
    import { UserService } from '../services/user.service';

    @Component({
        selector: 'app-user-list',
        templateUrl: './user-list.component.html',
        styleUrls: ['./user-list.component.scss']
    })
    export class UserListComponent implements OnInit, OnDestroy {

        users: User[];
        userSubscription: Subscription;

        constructor(private userService: UserService) { }

        ngOnInit() {
            this.userSubscription = this.userService.userSubject.subscribe(
                (users: User[]) => {
                    this.users = users;
                }
            );
            this.userService.emitUsers();
        }

        ngOnDestroy() {
            this.userSubscription.unsubscribe();
        }
    }


dans `user-list.component.html`

Ici, on applique des directives  *ngFor  et  *ngIf  pour afficher la liste des utilisateurs et 
leurs hobbies, s'ils en ont.

    <ul class="list-group">
        <li class="list-group-item" *ngFor="let user of users">
            <h3>{{ user.firstName }} {{ user.lastName }}</h3>
            <p>{{ user.email }}</p>
            <p>Cette persone préfère le {{ user.drinkPreference }}</p>
            <p *ngIf="user.hobbies && user.hobbies.length > 0">
            Cette personne a des hobbies !
            <span *ngFor="let hobby of user.hobbies">{{ hobby }} - </span>
            </p>
        </li>
    </ul>




Afin de pouvoir visualiser ce nouveau component, ajoutez une route  users  dans  `AppModule` ,   
`{ path: 'users', component: UserListComponent },`

et créez un  routerLink dans la navbar de `app.component.html`
`<li routerLinkActive="active" class="active" class="nav-item"><a class="nav-link" routerLink="users">Liste des users</a></li>`

Ajoutez également un objet  User  codé en dur dans le service pour voir les résultats :

dans `User.service.ts`
    private users: User[] = [
        new User('Will', 'Alexander', 'will@will.com', 'jus d\'orange', ['coder', 'boire du café'])
    ];


Dernière étape : il faut ajouter  `ReactiveFormsModule , importé depuis  @angular/forms` , à l'array  imports  de votre  `AppModule`  :

    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot(appRoutes)
    ],



## Construisez un formulaire avec FormBuilder

Dans la `méthode template`, l'objet formulaire mis à disposition par Angular était de `type  NgForm` , 
mais ce n'est pas le cas pour les formulaires réactifs.  `Un formulaire réactif est de type  FormGroup` , 
et il regroupe plusieurs  FormControl  (tous les deux importés depuis  @angular/forms ). 

On va commencer d'abord, par créer l'objet dans notre nouveau component  NewUserComponent 

Ensuite, on va créer une méthode qui sera appelée dans le constructeur pour la population de cet objet, 
et on va également injecter  `FormBuilder , importé depuis  @angular/forms`  

`FormBuilder est une classe qui met à disposition des méthodes facilitant la création d'objet FormGroup.`  
On va maintenant utiliser la méthode group à l'intérieur de notre méthode initForm() pour commencer à créer le formulaire.

`La méthode group prend comme argument un objet où les clés correspondent aux noms des contrôles souhaités` 
`et les valeurs correspondent aux valeurs par défaut de ces champs. ` 
Puisque l'objectif est d'avoir des champs vides au départ, chaque valeur ici correspond au string vide.


Exemple dans `new-user.component.ts` :

    import { Component, OnInit } from '@angular/core';
    import { FormBuilder, FormGroup } from '@angular/forms';

    @Component({
    selector: 'app-new-user',
    templateUrl: './new-user.component.html',
    styleUrls: ['./new-user.component.scss']
    })
    export class NewUserComponent implements OnInit {

        userForm: FormGroup;

       constructor(private formBuilder: FormBuilder) { }

        ngOnInit(): void {
             this.initForm();
        }

         initForm() 
        {
            this.userForm = this.formBuilder.group({
                firstName: '',
                lastName: '',
                email: '',
                drinkPreference: ''
            });
        }

    }



maintenant, il faut `créer le template du formulaire et lier ce template à l'objet userForm` qu'on a créer `dans new-user.component.ts` :


exemple dans `new-user.component.html` : 

    <div class="col-sm-8 col-sm-offset-2">
        <form [formGroup]="userForm" (ngSubmit)="onSubmitForm()">
            <div class="form-group">
                <label for="firstName">Prénom</label>
                <input type="text" id="firstName" class="form-control" formControlName="firstName">
            </div>
            <div class="form-group">
                <label for="lastName">Nom</label>
                <input type="text" id="lastName" class="form-control" formControlName="lastName">
            </div>
            <div class="form-group">
                <label for="email">Adresse e-mail</label>
                <input type="text" id="email" class="form-control" formControlName="email">
            </div>
            <div class="form-group">
                <label for="drinkPreference">Quelle boisson préférez-vous ?</label>
                <select id="drinkPreference" class="form-control" formControlName="drinkPreference">
                    <option value="jus d\'orange">Jus d'orange</option>
                    <option value="jus de mangue">Jus de mangue</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Soumettre</button>
        </form>
    </div>


Analysons le template :

Sur la balise  <form> , on utilise le `property binding pour lier l'objet userForm  à l'attribut  formGroup du formulaire,` 
`créant la liaison pour Angular entre le template et le TypeScript.`

Toujours dans la balise  <form> , on a toujours une `méthode  onSubmitForm()  liée à ngSubmit`,
mais on n'a plus besoin de passer le formulaire comme argument puisque vous y avez déjà accès par l'objet  userForm  que vous avez créé.

Sur chaque <input> qui correspond à un control du formulaire, on ajoute l'attribut `formControlName` 
où `on passe un string correspondant au nom du control  dans l'objet TypeScript.`

Le bouton de type submit déclenche l'événement ngSubmit, déclenchant ainsi la méthode onSubmitForm(), 
que vous allez créer dans votre TypeScript.


---------------------------------------------------------------------------------------------------------

Pour tout mettre ensemble, on injecte  UserService et Router (sans oublier de les importer) dans le constructeur du component, 
et on crée la méthode  onSubmitForm() 

Exemple dans `new-user.component.ts` :

    import { Component, OnInit } from '@angular/core';
    import { FormBuilder, FormGroup } from '@angular/forms';
    import { UserService } from '../services/user.service';
    import { Router } from '@angular/router';
    import { User } from '../models/User.model';

    @Component({
    selector: 'app-new-user',
    templateUrl: './new-user.component.html',
    styleUrls: ['./new-user.component.scss']
    })
    export class NewUserComponent implements OnInit {

        userForm: FormGroup;

        constructor(private formBuilder: FormBuilder,
                    private userService: UserService,
                    private router: Router) { }

        ngOnInit() {
            this.initForm();
        }

        initForm() {
            this.userForm = this.formBuilder.group({
            firstName: '',
            lastName: '',
            email: '',
            drinkPreference: ''
            });
        }

        onSubmitForm() {
            const formValue = this.userForm.value;
            const newUser = new User(
            formValue['firstName'],
            formValue['lastName'],
            formValue['email'],
            formValue['drinkPreference']
            );
            this.userService.addUser(newUser);
            this.router.navigate(['/users']);
        }

    }


La méthode  onSubmitForm()  récupère la  value  du formulaire, et crée un nouvel objet  User  
(à importer en haut) à partir de la valeur des  controls  du formulaire.  Ensuite, 
elle ajoute le nouvel utilisateur au service et navigue vers  /users  pour en montrer le résultat.



Il ne reste plus qu'à ajouter un lien dans  UserListComponent  qui permet d'accéder à  NewUserComponent  
et de créer la route correspondante  new-user  dans  AppModule 


    <ul class="list-group">

        <li class="list-group-item" *ngFor="let user of users">
            <h3>{{ user.firstName }} {{ user.lastName }}</h3>
            <p>{{ user.email }}</p>
            <p>Cette persone préfère le {{ user.drinkPreference }}</p>
            <p *ngIf="user.hobbies && user.hobbies.length > 0">
                Cette personne a des hobbies !
                <span *ngFor="let hobby of user.hobbies">{{ hobby }} - </span>
            </p>
        </li>
        <a routerLink="/new-user">Nouvel utilisateur</a>

    </ul>


Puisque ce routerLink se trouve à l'intérieur du  router-outlet , 
`il faut ajouter un  /  au début de l'URL pour naviguer vers  localhost:4200/new-user` .  
Si vous ne mettez pas le  / , ce lien naviguera vers  localhost:4200/users/new-user


dans app.module.ts

{ path: 'users', component: UserListComponent },
{ path: 'new-user', component: NewUserComponent },





## Validators

Comme pour la méthode template, `il existe un outil pour la validation de données dans la méthode réactive` : les  Validators .  
Pour ajouter la validation, on va modifier légèrement votre exécution de  FormBuilder.group 

exemple dans new-user.component.ts

    initForm() {
        this.userForm = this.formBuilder.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        drinkPreference: ['', Validators.required]
        });
    }


Plutôt qu'un string simple, on passez un array à chaque  control , 
avec comme premier élément la valeur par défaut souhaitée, 
et comme deuxième élément le ou les  Validators  (dans un array s'il y en a plusieurs) souhaités.  

Il faut également importer  Validators  depuis  @angular/forms .  
Dans ce cas de figure, tous les champs sont requis et la valeur du champ  email  doit être sous un format valable d'adresse mail (la validité de l'adresse elle-même n'est forcément pas évaluée).


Même si les  Validators  sont des fonctions, il ne faut pas ajouter les parenthèses  ()  en les déclarant ici.  
Les déclarations de  Validators  dans  FormBuilder  informent Angular de la validation souhaitée : 
Angular s'occupe ensuite d'exécuter ces fonctions au bon moment.

-----------------------------------------------

En liant la validité de  userForm  à la propriété  disabled  du bouton  submit , on intégre la validation de données :

<button type="submit" class="btn btn-primary" [disabled]="userForm.invalid">Soumettre</button>




## Ajouter dynamiquement des FormControl

Pour l'instant, on pas encore laissé la possibilité à l'utilisateur d'ajouter ses hobbies.  
Il serait intéressant de lui laisser la possibilité d'en ajouter autant qu'il veut, et pour cela, 
`on va utiliser un  FormArray .`  
`Un  FormArray  est un array de plusieurs FormControl, et permet`, par exemple,
`d'ajouter des nouveaux  controls  à un formulaire.`  
on va utiliser cette méthode pour permettre à l'utilisateur d'ajouter ses hobbies.

exemple dans new-user.component.ts

    initForm() {
        this.userForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            drinkPreference: ['', Validators.required],
            hobbies: this.formBuilder.array([])
        });
    }



Ensuite on Modifie onSubmitForm() pour récupérer les valeurs, 
si elles existent (sinon, retournez un array vide)

toujours dans new-user.component.ts

    onSubmitForm() {
        const formValue = this.userForm.value;
        const newUser = new User(
            formValue['firstName'],
            formValue['lastName'],
            formValue['email'],
            formValue['drinkPreference'],
            formValue['hobbies'] ? formValue['hobbies'] : []
        );
        this.userService.addUser(newUser);
        this.router.navigate(['/users']);
    }



Afin d'avoir accès aux controls à l'intérieur de l'array, 
pour des raisons de typage strict liées à TypeScript, 
il faut créer une méthode qui retourne hobbies par la méthode get() sous forme de FormArray ( FormArray  s'importe depuis  @angular/forms ) 

toujours dans new-user.component.ts

    getHobbies(): FormArray {
        return this.userForm.get('hobbies') as FormArray;
    }



Ensuite, on va créer la méthode qui permet d'ajouter un FormControl à hobbies , 
permettant ainsi à l'utilisateur d'en ajouter autant qu'il veut.  
On va également rendre le nouveau champ requis, afin de ne pas avoir un array de hobbies avec des string vides .

toujours dans new-user.component.ts

    onAddHobby() {
        const newHobbyControl = this.formBuilder.control(null, Validators.required);
        this.getHobbies().push(newHobbyControl);
    }

Cette méthode crée un  control  avec la méthode  FormBuilder.control() , 
et l'ajoute au  FormArray  rendu disponible par la méthode  getHobbies()


Enfin, il faut ajouter une section au template qui permet d'ajouter des hobbies en ajoutant des  <input>  :

exemple dans new-user.component.html

    <div formArrayName="hobbies">
        <h3>Vos hobbies</h3>
        <div class="form-group" *ngFor="let hobbyControl of getHobbies().controls; let i = index">
            <input type="text" class="form-control" [formControlName]="i">
        </div>
        <button type="button" class="btn btn-success" (click)="onAddHobby()">Ajouter un hobby</button>
    </div>
    <button type="submit" class="btn btn-primary" [disabled]="userForm.invalid">Soumettre</button>



à la  <div>  qui englobe toute la partie  hobbies , on ajoute l'attribut  formArrayName , 
qui correspond au nom choisi dans votre TypeScript ;

la  <div>  de class  form-group  est ensuite répété pour chaque  FormControl  dans le  FormArray  (retourné par  getHobbies() , 
initialement vide, en notant l'index afin de créer un nom unique pour chaque  FormControl ;

dans cette  <div> , vous avec une  <input>  qui prendra comme  formControlName  l'index du  FormControl ;

enfin, on a le bouton (de type  button  pour l'empêcher d'essayer de soumettre le formulaire) 
qui déclenche  onAddHobby() , méthode qui, pour rappel, 
crée un nouveau  FormControl  (affichant une nouvelle instance de la  <div>  de class  form-group , et donc créant une nouvelle  <input> )