import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Eleve } from '../../../models/Eleve.model';
import { EleveService } from '../../../services/eleve/eleve.service'

@Component({
  selector: 'app-get-all-eleve',
  templateUrl: './get-all-eleve.component.html',
  styleUrls: ['./get-all-eleve.component.scss']
})
export class GetAllEleveComponent implements OnInit {

    public eleves: Eleve[];
    private eleveSubscribe: Subscription;

    constructor(
        private eleveService: EleveService,
        private router: Router
    ) { }



    ngOnInit() {

        /* this.eleveSubscribe = this.eleveService.eleve$.subscribe(

            ( eleves: Eleve[] ) => {
                this.eleves = eleves;
                console.log(eleves);
            }
        ); */
        // this.eleveService.getEleveAll();

        this.eleveService.getEleveAll().subscribe(
            
            (eleves : Eleve[] ) => {
                console.log(eleves);
                
                return this.eleves = eleves;
            },
            (error) => {

                error.message = 'Problème d\'accès à l\'api';
                error.status = 500;
                error.statusText = 'ERREUR SERVER';
                console.log(error);
                alert(error.message);
            }
        );

        this.eleveService.emitEleveSubject();

    }

    onGetOneEleve(id: string)
    {    
        this.router.navigate(['/eleves/single/' + id]);
    }

}
