import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }

  addNodoBlockchain(data:NuevoNodo) { 
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    data = {Ip:data.Ip}
    return this.http.post(this.envUrl.urlAddress+'/blockChain/addNodo',data, {headers:headers} )
 }


 
};

export class NuevoNodo{
 Ip: string
}

