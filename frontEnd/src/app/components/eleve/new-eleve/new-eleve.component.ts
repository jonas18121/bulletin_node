import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Eleve } from 'src/app/models/Eleve.model';
import { EleveService } from 'src/app/services/eleve/eleve.service';

@Component({
  selector: 'app-new-eleve',
  templateUrl: './new-eleve.component.html',
  styleUrls: ['./new-eleve.component.scss']
})
export class NewEleveComponent implements OnInit {

    public eleveForm : FormGroup;
    public errorMessage : string;

    constructor(
        private formBuilder : FormBuilder,
        private eleveService : EleveService,
        private router: Router,
    ) { }

    ngOnInit() 
    {
        this.initForm();
    }

    initForm()
    {
        this.eleveForm = this.formBuilder.group({

            firstName :       ['', Validators.required],
            lastName :        ['', Validators.required]
        }); 
    }

    onSubmitForm() 
    {
        const eleve = new Eleve();

        eleve.firstName = this.eleveForm.get('firstName').value;
        eleve.lastName = this.eleveForm.get('lastName').value;

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
