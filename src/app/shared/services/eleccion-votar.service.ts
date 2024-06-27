import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { FromBodyConsulta, idProcesoDto } from 'src/app/pages/votacion/votacion.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EleccionVotarService {
  url = 'https://localhost:5001/api/eleccion/'
  
  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }

  consultarSiVota(data:FromBodyConsulta) { 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });


    return this.http.post<any>(this.url + 'consultarSiVota', data , { headers: headers } )
  }


  getCandidatos(data:any){
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>('https://localhost:5001/api/eleccion/candidatos', data, {headers: headers});
  }
  // enviarSufragio() {}
}
