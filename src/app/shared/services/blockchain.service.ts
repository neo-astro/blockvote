import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {

  constructor(private http: HttpClient, private envUrl: EnvironmentUrlService) { }




};

export class NuevoNodo{
 ipNodo: string
}

