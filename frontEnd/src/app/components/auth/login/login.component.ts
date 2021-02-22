import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginForm : FormGroup;
    errorMessage : string;

    constructor(
        private formBuilder : FormBuilder,
        private router : Router,
        private authService : AuthService
    ) { }

    ngOnInit() {
        this.initForm();
    }

    initForm()
    {
        this.loginForm = this.formBuilder.group(

            {
                email :     ['', Validators.required],
                password :  ['', Validators.required]
            }
        );
    }

    onLogin() 
    {
        const email = this.loginForm.value.email;
        const password = this.loginForm.value.password;

        this.authService.login(email, password).then(
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
