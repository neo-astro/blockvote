import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Subscription, finalize } from 'rxjs';
import { UploadFileService } from '../shared/services/upload-file.service';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})
export class UploadFileComponent {
  imagePreview: string | ArrayBuffer
  selectedImage: File | null = null;
  imageName: string | null = null;

  ListaCandidatos : CandidatosDto[]  = []


  @ViewChild('fileInput') fileInput: ElementRef | undefined;
  @Output() outInputValor  = new EventEmitter<{nombre:string,img:string|ArrayBuffer, imgFile: File , dataSrc:string|any}>();
  
  
  // @Input('mostrarImgCandidato') mostrarImgCandidato : boolean | null
  // @Output() estadoVerCandidato = new EventEmitter

  // @Input('mostrarImgPartidoPolitico') mostrarImgPartidoPolitico : boolean | null
  // @Output() estadoVerPartidoPolitoco = new EventEmitter

  @Input('mostrarImg') mostrarImg:boolean | null
  @Output() cambiarView = new EventEmitter


  constructor() { }

  onImageSelected(event: Event): void {
    
    const input = event.target as HTMLInputElement;

    // Verifica si hay archivos seleccionados
    if (input.files && input.files.length > 0) {
      console.log('seleccionando')
      alert('input' + input)
      const file = input.files[0];
      alert('file upload' + file)
      // Verifica que el archivo seleccionado sea una imagen
        this.imageName = file.name
        this.cambiarView.emit(true)
        // Mostrar la vista previa
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
          console.log('imagenview',this.imagePreview)
          alert('se envia el obj'+ JSON.stringify(file))
          console.log('file' , file)
          console.log('file 2' , this.fileInput.nativeElement.value)
          console.log('file 3' , JSON.stringify({nombre:file.name, img:this.imageName, imgFile:file, dataSrc:this.imagePreview}))
          this.outInputValor.emit({nombre:file.name, img:this.imageName, imgFile:file, dataSrc:this.imagePreview})

        };
        reader.readAsDataURL(file);
        // console.log('render', reader.readAsDataURL(file))
        console.log('file solo',file)
        console.log('imagenview',this.imagePreview)
      
    } else{alert('no hay')}
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