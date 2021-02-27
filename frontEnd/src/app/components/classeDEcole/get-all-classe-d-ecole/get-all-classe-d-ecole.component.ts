import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ClasseDEcole } from 'src/app/models/ClasseDEcole.model';
import { ClasseDEcoleService } from 'src/app/services/classeDEcole/classe-d-ecole.service';

@Component({
  selector: 'app-get-all-classe-d-ecole',
  templateUrl: './get-all-classe-d-ecole.component.html',
  styleUrls: ['./get-all-classe-d-ecole.component.scss']
})
export class GetAllClasseDEcoleComponent implements OnInit {

    public classes : ClasseDEcole[];
    private classeDEcoleSubscribe : Subscription;

    constructor(
        private classeDEcoleService : ClasseDEcoleService,
        private router : Router
    ) { }

    ngOnInit() 
    {
        this.classeDEcoleService.getClasseDEcoleAll().subscribe(

            (classes : ClasseDEcole[]) => {
                console.log(classes);

                this.classes = classes;
            },
            (error) => {

                error.message = 'Problème d\'accès au serveur';
                error.status = 500;
                error.statusText = 'ERROR SERVER';
                console.log(error);
                alert(error.message);
            }
        );

        this.classeDEcoleService.emitClasseDEcoleSubject();
    }

}
