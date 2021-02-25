import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClasseDEcole } from 'src/app/models/ClasseDEcole.model';
import { Eleve } from 'src/app/models/Eleve.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ClasseDEcoleService } from 'src/app/services/classeDEcole/classe-d-ecole.service';
import { EleveService } from 'src/app/services/eleve/eleve.service';

@Component({
  selector: 'app-update-eleve',
  templateUrl: './update-eleve.component.html',
  styleUrls: ['./update-eleve.component.scss']
})
export class UpdateEleveComponent implements OnInit {

    public eleve : Eleve;
    public eleveForm : FormGroup;
    public errorMessage : string;
    public classeDEcoles : ClasseDEcole[];

    constructor(
        private formBuilder : FormBuilder,
        private eleveService : EleveService,
        private router : Router,
        private classeDEcoleService : ClasseDEcoleService,
        private authService : AuthService,
        private route : ActivatedRoute
    ) { }

    ngOnInit() 
    {
        this.initForm();
    }

    initForm()
    {

        this.classeDEcoleService.getClasseDEcoleAll().subscribe(

            (classes : ClasseDEcole[]) => {
                
                this.classeDEcoles = classes;
            }
        );

        this.route.params.subscribe(

            (params) => {
                this.eleveService.getEleveById(params.id).subscribe(

                    (eleve : Eleve) => {
                        
                        this.eleve = eleve;

                        this.eleveForm = this.formBuilder.group(
                            {
                                firstName :       [ this.eleve.firstName, Validators.required],
                                lastName :        [ this.eleve.lastName, Validators.required],
                                classe_d_ecole :  [ '', Validators.required]
                            }
                        );
                    }
                );
            }
        ); 
    }

    onSubmitForm()
    {
        const eleve = new Eleve();

        eleve._id = this.eleve._id;
        eleve.firstName = this.eleveForm.value.firstName;
        eleve.lastName = this.eleveForm.value.lastName;
        eleve.classe_d_ecole = this.eleveForm.value.classe_d_ecole; 

        this.eleveService.updateEleve(this.eleve._id, eleve)
            .subscribe(
                () => {
                    this.eleveForm.reset();
                    this.router.navigate(['/eleves/all']);
                },
                (error) => {

                    error.message = 'Vous n\'est pas autoriser a faire cette opération !';
                    error.status = 401;
                    error.statusText = 'Pas autoriser (Unauthorized)';
                    console.log(error);
                    alert(error.message);
                    
                }
            )
        ;
        this.eleveService.emitEleveSubject();
    }

}
