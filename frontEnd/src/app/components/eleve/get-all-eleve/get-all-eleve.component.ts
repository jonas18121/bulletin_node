import { Component, OnInit } from '@angular/core';
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

    constructor(private eleveService: EleveService) { }



    ngOnInit() {

        this.eleveSubscribe = this.eleveService.eleve$.subscribe(

            ( eleves: Eleve[] ) => {
                this.eleves = eleves;
                console.log(eleves);
            }
        );
        // this.eleveService.getEleveAll();

        this.eleveService.getEleveAll().subscribe((res : Eleve[] ) => {
            console.log(res);
            
            return this.eleves = res
        });

        // of(1,2,3)
        // .pipe(map((v) => v + 10))
        // .subscribe(console.log);
    }

}
