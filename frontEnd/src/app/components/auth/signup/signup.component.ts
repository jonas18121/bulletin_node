import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

    signupForm : FormGroup;
    errorMessage : string;

    constructor(
        private formBuilder : FormBuilder,
        private router : Router,
        private authService : AuthService,
    ) { }

    ngOnInit() 
    {
        this.initForm();
    }

    initForm() 
    {
        this.signupForm = this.formBuilder.group(
            {
                email : ['', 
                    [
                        Validators.required, 
                        Validators.email
                    ]
                ],
                password :  ['', Validators.required] 
            }
        );
    }

    onSignup()
    {
        const email = this.signupForm.value.email;
        const password = this.signupForm.value.password;

        this.authService.createNewUser(email, password).then(
            () => {
                this.router.navigate(['eleves/all']);
            }
        )
        .catch(
            (error) => {
                this.errorMessage = error.message;
            }
        );
    }

}
