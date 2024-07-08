import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Subscription, finalize } from 'rxjs';
import { UploadFileService } from '../../shared/services/upload-file.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent {
  imagePreview: string | ArrayBuffer
  imageName: string | null = null;


  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  @Output() outInputValor  = new EventEmitter<{nombre:string,img:string|ArrayBuffer, imgFile: File , dataSrc:string|any}>();
  
  
  @Input('mostrarImg') mostrarImg:boolean | null
  @Output() cambiarView = new EventEmitter


  constructor() { }

  onImageSelected(event: Event): void {
    
    const input = event.target as HTMLInputElement;

    // Verifica si hay archivos seleccionados
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
        this.imageName = file.name
        this.cambiarView.emit(true)
        const reader = new FileReader();

        reader.onload = () => {
          this.imagePreview = reader.result;
          alert('img preview' + this.imagePreview )
          // this.outInputValor.emit({nombre:file.name, img:this.imageName, imgFile:file, dataSrc:this.imagePreview})

        };
        reader.readAsDataURL(file);
        console.log('render', reader.readAsDataURL(file))
      
    }
  }

  resete(){ 
    this.fileInput.nativeElement.value= null

  }
}

export  class CandidatosDto{
  id:number
  nombre:string
  nombrePartidoPolitico:string
  fotoCandidato: string
  fotoPartidoPolitico : string

}
export  class CandidatosFileDto implements CandidatosDto{
  id: number;
  nombre:string
  nombrePartidoPolitico:string
  fotoCandidato: string
  fotoPartidoPolitico : string
  imgCandidato:string|ArrayBuffer
  imgPartidoPolitoco:string|ArrayBuffer
  imgFileCandidato:File
  imgFilePartidoPolitico:File
  dataSrcCandidato:string|any
  dataSrcPartidoPolitico:string|any
}