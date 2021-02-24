# Ecoutez l'utilisateur avec les Forms avec  La méthode template

En Angular, il y a `deux grandes méthodes pour créer des formulaires` :
.
    - `la méthode template` : on crée un formulaire dans le template, 
        et Angular l'analyse pour comprendre les différents inputs 
        et pour mettre à disposition le contenu ;
.
    - `la méthode réactive` : on crée un formulaire en TypeScript et dans le template. 
        Puis on fait la liaison manuellement.
        Cette approche est plus complexe, mais elle permet beaucoup plus de contrôle 
            avec une approche dynamique.


Ne pas oublier d'`importer FormsModule dans AppModule` si ce n'est pas déjà fait !

-------------------------------------------------------------------------------------

## Créer le formulaire

On va crée un nouveau Component AddAppareilComponent qui permettra à l'user 
d'enregistrer un nouvel appareil électrique :

exemple :

dans add-appareil.component.html

    < div class="row">
        < div class="col-sm-8 col-sm-offset-2">

            < form (ngSubmit)="onSubmit(form_add_appareil)" #form_add_appareil="ngForm">

                < div class="form-group">
                    < label for="name">Nom de l'appareil< /label>
                    < input type="text" id="name" class="form-control" name="name" ngModel>
                < /div>

                < div class="form-group">
                    < label for="status">Etata de l'appareil< /label>
                    < select id="status" class="form-control" name="status" ngModel>
                        < option value="allumé">Allumé< /option>
                        < option value="éteint">Eteint< /option>
                    < /select>
                < /div>

               < button class="btn btn-primary" type="submit">Enregistrer< /button>

            < /form>

        < /div>
    < /div>

`Angular` parcourt le template et `trouve la balise < form>`, `créant` ainsi `un objet qui`
`sera utilisable depuis le code TypeScript`. 

`On signale à Angular` quels inputs correspond à des controls,
c'est-à-dire `des champs dont le contenu est à soumettre`.

Pour cela, `il suffit d'ajouter deux attributs aux inputs` en question : 
un `attribut name`, qui correspondra à la `clef de la paire clef-valeur` qui sera rendu, 

et l'`attribut ngModel` , sans parenthèses ni crochets.  
ngModel `signale à Angular qu'on souhaite enregistrer ce contrôle.`

On déclare le `button de type submit` et on `ajoute (ngSubmit)="onSubmit(f)" #f="ngForm"` dans la balise  `< form >`
    < form (ngSubmit)="onSubmit(f)" #f="ngForm">

Déclarer le bouton de type submit à l'intérieur du  < form>  déclenche le comportement de soumission classique de HTML.  

En ajoutant l'`attribut  (ngSubmit)` , on reçois cette soumission et `on exécute la méthode  onSubmit()`.

L'`attribut  #f  est une référence locale`. c'est a dire qu'on donne simplement un nom à l'objet sur lequel on ajoute cet attribut ;
Ce nom sera ensuite utilisable par Angular

`De manière générale, on ne donne pas de valeur à une référence locale` : on écrit simplement  #f  ou  #my-name . 
`Dans le cas précis d'un formulaire en méthode template, on y attribue la valeur  ngForm  pour avoir accès à l'objet créé par Angular.`

Pour récapituler : quand l'utilisateur clique sur le bouton de type submit, 
la méthode que vous attribuez à  (ngSubmit)  est exécutée, 
et grâce à la référence locale  #f="ngForm" , on peut passer l'objet à la méthode 
(et donc la récupérer dans votre code TypeScript).

Pour avoir accès au formulaire, créez une nouvelle route dans  AppModule  et un  routerLink  correspondant 
dans la barre de menu :

    const appRoutes: Routes = [

        {path: 'appareils', canActivate: [AuthGuardService], component: AppareilViewComponent},
        {path: 'appareils/:id', canActivate: [AuthGuardService], component: SingleAppareilComponent},
        {path: 'add', canActivate: [AuthGuardService], component: AddAppareilComponent},
        {path: 'auth', component: AuthComponent},
        {path: '', component: AppareilViewComponent},
        {path: 'not-found', component: FourOhFourComponent},
        {path: '**', redirectTo: 'not-found'}
    ];


    < ul class="nav navbar-nav">
        < li routerLinkActive="active">< a routerLink="auth">Authentification</ a></ li>
        < li routerLinkActive="active">< a routerLink="appareils">Appareils</ a></ li>
        < li routerLinkActive="active">< a routerLink="edit">Nouvel appareil</ a></ li>
    < /ul>



## Valider les données

Pour le formulaire de cette application, on peut dire que `le nom de l'appareil est un champ obligatoire.`
`Pour ajouter cette obligation`, ajoute la directive suivante : `required`

`required` ressemble à un attribut HTML5 classique, mais sachez qu'`Angular désactive par défaut le`
`comportement de validation HTML5.`


exemple :
`    <input type="text" id="name" class="form-control" name="name" ngModel required>`


Pour `désactiver le bouton submit du formulaire tant que les champs son vide`, on va lier la propriété
`disabled` du bouton à la propriété  `invalid`  du formulaire, qui est mise à disposition par Angular :

`On utitlise la référence locale #form_add_appareil pour avoir accès à l'objet  NgForm ,` 
et donc à `sa propriété  invalid` , désactivant le bouton si elle retourne  true .

exemple :
`    <button class="btn btn-primary" type="submit" [disabled]="f.invalid">Enregistrer</button>`



### Réponse par défaut dans un formulaire

Pour déclarer une réponse par défaut, on va créer une variable TypeScript et la lier à la propriété  ngModel  du contrôle

Ainsi, le formulaire ne pourra être soumis que si le champ "Nom de l'appareil" n'est pas vide, et l'option
choisie par défaut empêche le deuxième champ d'être vide également.

exemple :

    export class EditAppareilComponent implements OnInit {
        defaultOnOff = 'éteint';
        constructor() { }
    }


    < select id="status" class="form-control" name="status" [ngModel]="defaultOnOff">
        < option value="allumé">Allumé</ option>
        < option value="éteint">Éteint</ option>
    </ select>




## Eploitez les données

Dans la méthode onSubmit(), on va récupéré les données et les attribuer à 2 constantes pour les envoyer à AppareilService

puisqu'on va forcément utiliser un champ name et un champ status dans ce formulaire, on peut les ecrire dans des constante 

exemple dans AppareilService :

    onSubmit(form: NgForm)
    {
        const name = form.value['value'];   
        const status = form.value['status'];
        this.appareilService.addAppareil(name, status);
        this.router.navigate(['/appareils']);
    }



    addAppareil(name: string, status: string)
    {
        const appareilObject = {
            id: 0,
            name: '',
            status: ''
        };

        appareilObject.name = name;
        appareilObject.status = status;
        appareilObject.id = this.appareilsSubject[(this.appareils.length - 1 )].id + 1;

        this.appareils.push(appareilObject);
        this.emitAppareilSubject();
    }


addAppareil crée un objet du bon format, et attribue le nom et le statut qui lui sont passés comme 
arguments.  `La ligne pour l'id prend l'id du dernier élément actuel de l'array et ajoute 1`.  Ensuite, 
l'objet complété est ajouté à l'array et le Subject est déclenché pour tout garder à jour.

Maintenant, grâce à un formulaire simple géré par la méthode template, l'utilisateur peut créer un nouvel appareil pour la liste.