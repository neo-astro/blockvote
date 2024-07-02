import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ProcesoService } from '../shared/services/proceso.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-upload-excel',
  templateUrl: './upload-excel.component.html',
  styleUrls: ['./upload-excel.component.css']
})
export class UploadExcelComponent {
  
  selectedFile: File | null = null;

  constructor(private http: HttpClient , private procesoService : ProcesoService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload() {

    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile, this.selectedFile.name);

      this.http.post('https://localhost:5001/vrg', formData)
        .subscribe(response => {
          console.log(response);
        });
    }
  }



  // addProcesos2(){
  //   this.http.post('https://localhost:5001/crear2', '4')
  //   .subscribe(response => {
  //     console.log(response);
  //   });
  // }  



  // getData() {
  //   this.http.get('https://localhost:5001/crear2')
  //     .subscribe(
  //       response => console.log('Respuesta GET:', response),
  //       error => console.error('Error GET:', error)
  //     );
  // }

  postData() {
    let formData: FormData = new FormData();
    formData.append('xd', 'xddd');

    this.http.post('https://localhost:5001/crear3',formData )
      .subscribe(
        response => console.log('Respuesta POST:', response),
        error => console.error('Error POST:', error)
      );

  }

  sendString(data: string): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const body = JSON.stringify({ data: data });
    return this.http.post<any>('https://localhost:5001/crear3', body, { headers: headers });
  }


  enviarString(): void {
    const miString = 'Este es el string que quiero enviar';
    this.sendString(miString).subscribe({
      next: (response) => {
        console.log('Respuesta de la API:', response);
      },
      error: (error) => {
        console.error('Error al enviar el string:', error);
      }
    });
  }
}
