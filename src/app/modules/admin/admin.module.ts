import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { ConfiguracionBlockchainComponent } from './configuracion-blockchain/configuracion-blockchain.component';
import { PanelProcesosComponent } from './panel-procesos/panel-procesos.component';
import { RouterModule } from '@angular/router';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { AdminGuard } from 'src/app/shared/guards/admin.guard';
import { FormTiempoProcesoComponent } from './form-tiempo-proceso/form-tiempo-proceso.component';



@NgModule({
  declarations: [
    EstadisticasComponent,
    ConfiguracionBlockchainComponent,
    PanelProcesosComponent,
    ConfiguracionComponent,
    FormTiempoProcesoComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([

      { path: 'panelprocesos', component:PanelProcesosComponent,canActivate: [AuthGuard,AdminGuard] } ,
      { path: 'estadisticas', component: EstadisticasComponent,canActivate: [AuthGuard,AdminGuard]},
      { path: 'configuracionblockchain', component: ConfiguracionBlockchainComponent,canActivate: [AuthGuard,AdminGuard]},
      { path: 'configuracion', component: ConfiguracionComponent,canActivate: [AuthGuard,AdminGuard]}

    ])
  ]
})
export class AdminModule { }
