# Angular authentification avec JSON Web Tokens (JWT)

Guide qui ma inspiré : https://medium.com/@swapnil.s.pakolu/angular-interceptors-multiple-interceptors-and-6-code-examples-of-interceptors-59e745b684ec

Autre guide Angular authentification avec JSON Web Tokens (JWT) fait d'une autre manière : https://blog.angular-university.io/angular-jwt-authentication/


## Creer la classe qui intercetpe la requête http

J'ai creer un dossier interceptors/ et dedans la classe auth-interceptor.ts. interceptors/auth-interceptor.ts

çà peut être aussi considéré comme un service, exemple : services/auth-interceptor.service.ts

`Dans interceptors/auth-interceptor.ts`

- import Injectable depuis '@angular/core' et on ajoute le décorateur @Injectable ({providedId: 'root'}) à la classe pour en faire un service Angular.

- import HttpInterceptor depuis '@angular/common/http' Implémenter HttpInterceptor pour en faire un Interceptor.

- importer HttpRequest, HttpHandler, HttpEvent à partir de '@angular/common/http' et implémenter la fonction d'interception car notre classe hérite/implémente de HttpInterceptor.

- La fonction d'intercept renverra next.handle (request) ;. Cela signifie que nous passons le contrôle au prochain intercepteur de la chaîne, s'il y en a un.

- (facultatif) 
Authentification / Intercepteur de session
Authentication Interceptor peut être utilisé pour ajouter un en-tête d'authentification à votre demande. 
Vous pouvez même acheminer l'application vers la page de connexion si l'utilisateur n'est pas authentifié.

- ajouter la dépendance AuthService dans le paramètre du constructeur.

- vérifier si l'utilisateur est authentifié à l'aide de this.authService.isAuth$.value

- si l'utilisateur est authentifié, ajouter le jeton d'authentification à l'en-tête de la demande. 
ici, nous utilisons request.clone () car la requête est un objet immuable.

- si l'utilisateur n'est pas authentifié, dirigez-le vers la page de connexion.


`Résultat dans interceptors/auth-interceptor.ts`

    import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
    import { Injectable } from "@angular/core";
    import { Router } from "@angular/router";
    import { Observable } from "rxjs";
    import { AuthService } from "../services/auth/auth.service";

    @Injectable()

    export class AuthInterceptor implements HttpInterceptor {

        constructor(
            private authService : AuthService,
            private router : Router
        ) {}
        
        intercept(request : HttpRequest<any>, next : HttpHandler) : Observable<HttpEvent<any>> {
            
            if (this.authService.isAuth$.value) {
            
                const authToken = this.authService.token;

                request = request.clone({
                    headers : request.headers.set('Authorization', 'Bearer ' + authToken)
                });
            }
            else{
                // this.router.navigate(['auth/login']);
            }
            
            return next.handle(request);
        }
    }



## Configurer app.module.ts

`Dans app.module.ts` :

- on importe HTTP_INTERCEPTORS qui vient de @angular/common/http
- on importe notre interceptor nommé AuthInterceptor
- on renseigne HTTP_INTERCEPTORS et AuthInterceptor dans le providers dans @NgModule

HTTP_INTERCEPTORS = un jeton multi-fournisseur qui représente le tableau des HttpInterceptors qui sont enregistrés.

AuthInterceptor = notre creation

provide = mentionnez-le comme HTTP_INTERCEPTORS

useClass = mentionnez la classe qui doit être ajoutée au tableau HttpInterceptors

multi: true =  c'est un paramètre obligatoire qui indique à angular que le jeton est multi-fournisseur. 
L'application lancera une erreur si vous la définissez sur false.

    providers: [
        EleveService,
        ClasseDEcoleService,
        AuthService,
        {
            provide : HTTP_INTERCEPTORS,
            useClass : AuthInterceptor,
            multi : true
        }
    ],


`Résultat dans app.module.ts` :

    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';
    import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
    import { RouterModule, Routes } from '@angular/router';
    import { FormsModule, ReactiveFormsModule } from '@angular/forms';

    ////////////////////////// I N T E R C E P T O R S ///////////////////////////
    import { AuthInterceptor } from './interceptors/auth-interceptor';

    ////////////////////////// S E R V I C E S //////////////////////////////////
    import { EleveService } from './services/eleve/eleve.service'
    import { ClasseDEcoleService } from './services/classeDEcole/classe-d-ecole.service'
    import { AuthService } from './services/auth/auth.service'

    ////////////////////////// C O M P O N E N T S /////////////////////////////
    import { AppComponent } from './app.component';
    import { GetAllEleveComponent } from './components/eleve/get-all-eleve/get-all-eleve.component';
    import { GetOneEleveComponent } from './components/eleve/get-one-eleve/get-one-eleve.component';
    import { NewEleveComponent } from './components/eleve/new-eleve/new-eleve.component';
    import { LoginComponent } from './components/auth/login/login.component';

    const appRoutes: Routes = [

        { path: 'eleves',
            children: [
                { path: 'all', component: GetAllEleveComponent },
                { path: 'single/:id', component: GetOneEleveComponent },
                { path: 'new', component: NewEleveComponent },
                { path: '', pathMatch: 'full', redirectTo: 'all' },
                { path: '**', redirectTo: 'all' }
            ]  
        },
        { path: 'auth',
            children :[
                // { path: 'signup', component: SignunComponent },
                { path: 'login', component: LoginComponent },
                { path: '', pathMatch: 'full', redirectTo: 'login' },
                { path: '**', redirectTo: 'login' }
            ]
        },
        { path: '', pathMatch: 'full', redirectTo: 'eleves/all' },
        { path: '**', redirectTo: 'eleves/all' }
    ];

    @NgModule({
    declarations: [
        AppComponent,
        GetAllEleveComponent,
        GetOneEleveComponent,
        NewEleveComponent,
        LoginComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        FormsModule, 
        ReactiveFormsModule,
        RouterModule.forRoot(appRoutes)
    ],
    providers: [
        EleveService,
        ClasseDEcoleService,
        AuthService,
        {
            provide : HTTP_INTERCEPTORS,
            useClass : AuthInterceptor,
            multi : true
        }
    ],
    bootstrap: [AppComponent]
    })
    export class AppModule { }
