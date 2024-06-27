import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { EleccionVotarService } from 'src/app/shared/services/eleccion-votar.service';
import { ToastServiceService } from 'src/app/shared/services/toast.service.service';

@Component({
  selector: 'app-votacion',
  templateUrl: './votacion.component.html',
  styleUrls: ['./votacion.component.css']
})
export class VotacionComponent implements OnInit, AfterViewInit {
  email: string;
  idProceso: string;
  secretKey: string;
  eleccionAprobada: boolean;
  votaOrNo: boolean = null;
  timeValidoVotar: boolean;

  fechaHoraActual: string = new Date().toLocaleString();
  fechaHoraInicio: string;
  fechaHoraFin: string;
  resCandidatos: any;
  dataInfo: any;
  selectedCandidato: any = null;

  constructor(private route: ActivatedRoute, private router: Router, private eleccionVotarService: EleccionVotarService, private _toastService: ToastServiceService) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.email = params.get('email');
      this.idProceso = params.get('idProceso');
      this.secretKey = params.get('secretKey');
    });

    this.consultarSiVota();
    setInterval(() => {
      this.fechaHoraActual = new Date().toLocaleString();
    }, 1000);

    const dato: idProcesoDto = { idProceso: Number.parseInt(this.idProceso) };
    this.obtenerCandidatos(dato);
  }

  ngAfterViewInit(): void {}

  public async consultarSiVota() {
    const data: FromBodyConsulta = {
      email: this.email,
      idProceso: this.idProceso,
      secretKey: this.secretKey
    };
    
    this.eleccionVotarService.consultarSiVota(data).subscribe(
      (res: any) => {
        console.log('Consulta resultado:', res[0]);
        this.dataInfo = res[0];
        this.votaOrNo = res[0] !== undefined;

        let fechaInicio = new Date(res[0].procesoElectoral.fechaInicio).toLocaleString();
        let fechaFin = new Date(res[0].procesoElectoral.fechaFin).toLocaleString();
        if (this.fechaHoraActual >= fechaInicio && this.fechaHoraActual <= fechaFin) {
          this.timeValidoVotar = true;
        } else {
          this.timeValidoVotar = false;
        }

        console.log('Data info después de asignación:', this.dataInfo);
      },
      error => {
        console.error('Error al consultar si vota:', error);
        alert(error);
      }
    );
  }

  public async obtenerCandidatos(dato: any) {
    this.eleccionVotarService.getCandidatos(dato).subscribe(
      (res: any) => {
        this.resCandidatos = res;
        console.log('candidatos res', res);
        return res;
      },
      error => {
        console.error('Error candidatos:', error);
        alert(error);
      }
    );
  }

  onCheckboxChange(candidato: any) {
    if (this.selectedCandidato === candidato) {
      this.selectedCandidato = null; 
    } else {
      this.selectedCandidato = candidato;
    }
  }

  enviarVoto(event: Event) {
    event.preventDefault();
    if (this.selectedCandidato) {
      console.log('Candidato seleccionado:', this.selectedCandidato);
    } else {
      console.log('No hay candidato seleccionado');
    }
    alert('enviado');
    this.router.navigate(["/"]);
    this._toastService.showNotification('¡Voto enviado satisfactoriamente!');
  }
}

export class FromBodyConsulta {
  email: string;
  idProceso: string;
  secretKey: string;
}

export class idProcesoDto {
  idProceso: number;
}
