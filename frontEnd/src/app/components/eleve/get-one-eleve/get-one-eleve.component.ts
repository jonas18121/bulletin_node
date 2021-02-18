import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Eleve } from 'src/app/models/Eleve.model';
import { EleveService } from 'src/app/services/eleve/eleve.service';

@Component({
  selector: 'app-get-one-eleve',
  templateUrl: './get-one-eleve.component.html',
  styleUrls: ['./get-one-eleve.component.scss']
})
export class GetOneEleveComponent implements OnInit {

    public eleve: Eleve;

    constructor(
        private eleveService: EleveService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(){

        this.route.params.subscribe(
            (params: Params) => {
                this.eleveService.getEleveById(params.id).subscribe(
                    (eleve: Eleve) => {
                        console.log(eleve);
                        
                        return this.eleve = eleve;
                    }
                );
            }
        );

        this.eleveService.emitEleveSubject();

    }

}
