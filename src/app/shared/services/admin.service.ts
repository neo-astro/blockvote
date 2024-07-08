import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { NuevoNodo } from './blockchain.service';

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

 
 addNodoBlockchain(data:NuevoNodo) { 
  const headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  data = {Ip:data.Ip}
  return this.http.post(this.envUrl.urlAddress+'/Administrador/blockChain/addNodo',data, {headers:headers} )
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


