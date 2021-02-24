creer un nouveau projet
    `ng new mon-projet-angular --style=scss --skip-tests=true`

installer bootstrap
    pour avoir une version précise : `npm install bootstrap@3.3.7` 
    sinon : `npm install bootstrap` 
    puis mettre `"node_modules/bootstrap/dist/css/` dans angular.json 

    ex:
    "styles": [
        "node_modules/bootstrap/dist/css/bootstrap.css",
        "styles.scss"
    ]


lancer le serveur : 
        
        ng serve 

ou

lancer le serveur en continue : 
        
        ng serve --open

avec ng generate on peut l'associer avec ces argument : 

        appShell
        application
        class
        component
        directive
        enum
        guard
        interceptor
        interface
        library
        module
        pipe
        service
        serviceWorker
        webWorker


créer un nouveau `Component` : 
        
        ng generate component mon-premier ou ng g c mon-premier

créer une `Directive` personaliser : 
        
        ng generate directive nom_de_directive ou ng g d nom_de_directive

créer une `Pipe` personaliser : 
        
        ng generate pipe nom_de_pipe ou ng g p nom_de_pipe

créer un `Service` personaliser : 
        
        ng generate service nom_de_service ou ng g s nom_de_service

créer une `Class` personaliser : 
        
        ng generate class nom_de_class

créer un `Guard` personaliser : 
        
        ng generate guard guard/nom_de_guard ou ng g g guard/nom_de_guard

créer une `Interface` personaliser : 
        
        ng generate interface nom_de_interface ou ng g i nom_de_interface

créer un `Enum` personaliser : 
        
        ng generate enum nom_de_enum

créer un `Module` personaliser : 
        
        ng generate module nom_de_module



pour compiler le projet Angular avant le déploiment qui sera dans un répèrtoire dist et pas encore une complilation finale :
        
        ng build

Compiler en mode prod : 
        
        ng build --prod