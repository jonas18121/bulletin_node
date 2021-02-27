import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Eleve } from 'src/app/models/Eleve.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { EleveService } from 'src/app/services/eleve/eleve.service';

@Component({
  selector: 'app-get-one-eleve',
  templateUrl: './get-one-eleve.component.html',
  styleUrls: ['./get-one-eleve.component.scss']
})
export class GetOneEleveComponent implements OnInit {

    public eleve : Eleve;
    public isAuth : boolean;
    public isAuthSubscription : Subscription; 

    constructor(
        private eleveService: EleveService,
        private router: Router,
        private route: ActivatedRoute,
        private authService : AuthService
    ) { }

    ngOnInit()
    {
        this.initAuth();

        this.route.params.subscribe(
            (params: Params) => {
                this.eleveService.getEleveById(params.id).subscribe(

                    (eleve: Eleve) => {
                        console.log(eleve);
                        
                        return this.eleve = eleve;
                    },
                    (error) => {

                        error.message = 'Problème d\'accès au serveur';
                        error.status = 500;
                        error.statusText = 'ERROR SERVER';
                        console.log(error);
                        alert(error.message);
                        
                    }
                );
            }
        );

        this.eleveService.emitEleveSubject();
    }

    onGetUpdateEleve(id : string)
    {
        this.router.navigate(['/eleves/update/' + id])
    }

    onDeleteEleve()
    {
        this.eleveService.deleteEleve(this.eleve._id)
            .subscribe(

                () => {
                    this.router.navigate(['/eleves/all']);
                    alert('Cette élève a bien été supprimer !');
                },
                (error) => {

                    error.message = 'Vous n\'est pas autoriser à faire cette opération !';
                    error.status = 401;
                    error.statusText = 'Pas autoriser (Unauthorized)';
                    console.log(error);
                    alert(error.message);
                    
                }
            )
        ;
    }

    initAuth()
    {
        this.isAuthSubscription = this.authService.isAuth$.subscribe(
            (auth) => {
                this.isAuth = auth;
            }
        );
    }

}
