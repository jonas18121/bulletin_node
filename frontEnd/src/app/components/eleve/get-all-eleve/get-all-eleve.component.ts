import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Eleve } from '../../../models/Eleve.model';
import { EleveService } from '../../../services/eleve/eleve.service'

@Component({
  selector: 'app-get-all-eleve',
  templateUrl: './get-all-eleve.component.html',
  styleUrls: ['./get-all-eleve.component.scss']
})
export class GetAllEleveComponent implements OnInit {

    public eleves: Eleve[] = [];
    private eleveSubscribe: Subscription;

    constructor(private eleveService: EleveService) { }



    ngOnInit() {

        this.eleveSubscribe = this.eleveService.eleve$.subscribe(

            ( eleves: Eleve[] ) => {
                this.eleves = eleves;
            }

        );
        this.eleveService.getEleve();
    }

}
