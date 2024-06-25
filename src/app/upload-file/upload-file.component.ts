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

  selectedImage: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
  imageName: string | null = null;


  @Output() fileSelected = new EventEmitter<string>();
  @ViewChild('fileInput') fileInput: ElementRef | undefined;

  constructor(private imageUploadService: UploadFileService) { }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Verifica si hay archivos seleccionados
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Verifica que el archivo seleccionado sea una imagen
      if (file.type.startsWith('image/')) {
        this.selectedImage = file;
        this.imageName = file.name;

        // Mostrar la vista previa
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreview = reader.result;
        };
        reader.readAsDataURL(file);

        // Enviar la imagen
        this.imageUploadService.uploadImage(file).subscribe({
          next: (res) => {
            console.log(res.response);
            alert('enviado')
          }
        });
        
        this.fileSelected.emit(file.name);


      } else {
        console.error('El archivo seleccionado no es una imagen.');
      }
    } else {
      // Restaura el último archivo seleccionado si no se seleccionó ningún archivo nuevo
      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
    }
  }
}
