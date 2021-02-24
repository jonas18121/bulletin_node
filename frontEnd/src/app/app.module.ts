import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

////////////////////////// I N T E R C E P T O R S ///////////////////////////
import { AuthInterceptor } from './interceptors/auth-interceptor';

////////////////////////// S E R V I C E S //////////////////////////////////
import { EleveService } from './services/eleve/eleve.service'
import { ClasseDEcoleService } from './services/classeDEcole/classe-d-ecole.service'
import { AuthService } from './services/auth/auth.service'

////////////////////////// C O M P O N E N T S /////////////////////////////
import { AppComponent } from './app.component';
import { GetAllEleveComponent } from './components/eleve/get-all-eleve/get-all-eleve.component';
import { GetOneEleveComponent } from './components/eleve/get-one-eleve/get-one-eleve.component';
import { NewEleveComponent } from './components/eleve/new-eleve/new-eleve.component';
import { LoginComponent } from './components/auth/login/login.component';

const appRoutes: Routes = [

    { path: 'eleves',
        children: [
            { path: 'all', component: GetAllEleveComponent },
            { path: 'single/:id', component: GetOneEleveComponent },
            { path: 'new', component: NewEleveComponent },
            { path: '', pathMatch: 'full', redirectTo: 'all' },
            { path: '**', redirectTo: 'all' }
        ]  
    },
    { path: 'auth',
        children :[
            // { path: 'signup', component: SignunComponent },
            { path: 'login', component: LoginComponent },
            { path: '', pathMatch: 'full', redirectTo: 'login' },
            { path: '**', redirectTo: 'login' }
        ]
    },
    { path: '', pathMatch: 'full', redirectTo: 'eleves/all' },
    { path: '**', redirectTo: 'eleves/all' }
];

@NgModule({
  declarations: [
    AppComponent,
    GetAllEleveComponent,
    GetOneEleveComponent,
    NewEleveComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    EleveService,
    ClasseDEcoleService,
    AuthService,
    {
        provide : HTTP_INTERCEPTORS,
        useClass : AuthInterceptor,
        multi : true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
