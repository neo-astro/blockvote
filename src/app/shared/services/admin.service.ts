import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { NuevoNodo } from './blockchain.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }

  obtenerTiempoProceso(){
    return this.http.get<any>(this.envUrl.urlAddress+'/Administrador/tiempoProcesos')
  }

  
  cambiarTiempoProcesos(data:number) { 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(this.envUrl.urlAddress+'/Administrador/cambiarTiempoProcesos',data,{headers:headers} )
 }

 

 addNodoBlockchain(data: NuevoNodo): Observable<any> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  const payload = { ipNodo: data.ipNodo };
  const url = `${this.envUrl.urlAddress}/Administrador/blockChain/addNodo`;

  return this.http.post(url, payload, { headers: headers });
}

removerNodoBlockchain(data:string) { 
const headers = new HttpHeaders({
  'Content-Type': 'application/json'
});
let body = {"ipNodo":data}

return this.http.post(this.envUrl.urlAddress+'/Administrador/blockChain/removerNodo',body, {headers:headers} )
}

obtenerNodosBlockchain() { 
return this.http.get(this.envUrl.urlAddress+'/Administrador/blockChain/obtenerNodosBlockchain' )
}



}


