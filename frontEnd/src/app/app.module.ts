import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


////////////////////////// S E R V I C E S /////////////////////////////////
import { EleveService } from './services/eleve/eleve.service'

////////////////////////// C O M P O N E N T S /////////////////////////////
import { AppComponent } from './app.component';
import { GetAllEleveComponent } from './components/eleve/get-all-eleve/get-all-eleve.component';
import { GetOneEleveComponent } from './components/eleve/get-one-eleve/get-one-eleve.component';
import { NewEleveComponent } from './components/eleve/new-eleve/new-eleve.component';

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
    { path: '', pathMatch: 'full', redirectTo: 'eleves/all' },
    { path: '**', redirectTo: 'eleves/all' }
];

@NgModule({
  declarations: [
    AppComponent,
    GetAllEleveComponent,
    GetOneEleveComponent,
    NewEleveComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    EleveService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
