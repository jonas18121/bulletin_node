import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Eleve } from 'src/app/models/Eleve.model';
import { EleveService } from 'src/app/services/eleve/eleve.service';
import { ClasseDEcoleService } from 'src/app/services/ClasseDEcole/Classe-d-ecole.service';
import { ClasseDEcole } from 'src/app/models/ClasseDEcole.model';

@Component({
  selector: 'app-new-eleve',
  templateUrl: './new-eleve.component.html',
  styleUrls: ['./new-eleve.component.scss']
})
export class NewEleveComponent implements OnInit {

    public eleveForm : FormGroup;
    public errorMessage : string;
    public classeDEcoles : ClasseDEcole[];

    constructor(
        private formBuilder : FormBuilder,
        private eleveService : EleveService,
        private router : Router,
        private classeDEcoleService : ClasseDEcoleService
    ) { }

    ngOnInit() 
    {
        this.initForm();
    }

    initForm()
    {
        this.classeDEcoleService.getClasseDEcoleAll().subscribe(

            (classes : ClasseDEcole[]) => {
                
                return this.classeDEcoles = classes;
            }
        );
        this.eleveForm = this.formBuilder.group({

            firstName :       ['', Validators.required],
            lastName :        ['', Validators.required],
            classe_d_ecole :  ['', Validators.required]
        }); 
    }

    onSubmitForm() 
    {
        const eleve = new Eleve();

        eleve.firstName = this.eleveForm.get('firstName').value;
        eleve.lastName = this.eleveForm.get('lastName').value;
        eleve.classe_d_ecole = this.eleveForm.get('classe_d_ecole').value;

        this.eleveService.createNewEleve(eleve).then(
            () => {
                this.eleveForm.reset();
                this.router.navigate(['/eleves/all']);
            },
            (error) => {
                this.errorMessage = error.message;
            }
        );
    }

}
