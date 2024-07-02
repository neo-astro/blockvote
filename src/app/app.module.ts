import { AdminGuard } from './shared/guards/admin.guard';
import { AuthGuard } from './shared/guards/auth.guard';
import { ErrorHandlerService } from './shared/services/error-handler.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { JwtModule } from "@auth0/angular-jwt";
 
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { MenuComponent } from './menu/menu.component';
import { NotFoundComponent } from './error-pages/not-found/not-found.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';



import {MatListModule} from '@angular/material/list';
import { MatStepperModule } from '@angular/material/stepper';


import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FooterComponent } from './footer/footer.component';
import { LoginRegisterComponent } from './modules/authentication/login-register/login-register.component';
import { EleccionComponent } from './pages/eleccion/eleccion.component';
import { VotacionComponent } from './pages/votacion/votacion.component';
import { ResultadosComponent } from './pages/resultados/resultados.component';
import { ParticipantesComponent } from './pages/participantes/participantes.component';
import { RegisterUserComponent } from './modules/authentication/register-user/register-user.component';
import { ToastComponent } from './toast/toast.component';
import { MultiformsComponent } from './multiforms/multiforms.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { UploadExcelComponent } from './upload-excel/upload-excel.component';
import { QrAccessComponent } from './qr-access/qr-access.component';
import { PipeFullText } from './shared/helpers/PipeFullText';
import { ProcesosComponent } from './pages/procesos/procesos.component';


export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  declarations: [
    PipeFullText,
    AppComponent,
    HomeComponent,
    MenuComponent,
    NotFoundComponent,
    ForbiddenComponent, 
    FooterComponent,
    LoginRegisterComponent,
    EleccionComponent,
    VotacionComponent,
    ResultadosComponent,
    ParticipantesComponent,
    ToastComponent,
    MultiformsComponent,
    UploadFileComponent,
    UploadExcelComponent,
    QrAccessComponent,
    ProcesosComponent
  ],
  imports: [
    //modulos de ui
    MatListModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatStepperModule,
    MatInputModule,
    MatButtonModule,

    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CollapseModule.forRoot(),
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: 'eleccion', component:EleccionComponent,canActivate: [AuthGuard]},
      { path: 'participantes', component:ParticipantesComponent},
      { path: 'xd', component:UploadExcelComponent,canActivate: [AuthGuard]},
      { path: 'img', component:UploadFileComponent,canActivate: [AuthGuard]},
      { path: 'votacion', component:QrAccessComponent},
      { path: 'votacion/votar', component:VotacionComponent},
      { path: 'resultados', component:ResultadosComponent},


      { path: 'authentication', loadChildren: () => import('./modules/authentication/authentication.module').then(m => m.AuthenticationModule) },
      { path: '404', component : NotFoundComponent},
      { path: 'forbidden', component: ForbiddenComponent},
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: '**', redirectTo: '/404', pathMatch: 'full'},

      
      
    ]),
    RouterModule.forChild([
      // { path: 'consulta', component: ConsultaComponent },
    ]),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:5001"],
        disallowedRoutes: []
      }
    })
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }