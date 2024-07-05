import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }


  
  cambiarTiempoProcesos(data:number) { 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.envUrl.urlAddress+'/cambiarTiempoProcesos',data, {headers:headers} )
 }



}


// export class TimeProcesos{
  
// }