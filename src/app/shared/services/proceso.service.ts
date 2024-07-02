import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EnvironmentUrlService } from './environment-url.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcesoService {

  constructor(private http: HttpClient) { }
  
  public addProceso = (objecto:any) => {

   return this.http.post("https://localhost:5001/api/proceso/crear", objecto);
  }
}
