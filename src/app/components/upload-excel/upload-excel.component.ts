import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ProcesoService } from '../../shared/services/proceso.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-upload-excel',
  templateUrl: './upload-excel.component.html',
  styleUrls: ['./upload-excel.component.css']
})
export class UploadExcelComponent {
  files: { id: string, name: string, file: File, fileUrl: string }[] = [];
  selectedFile: File | null = null;
  editMode: boolean = false;
  editIndex: number = -1;

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  addFile() {
    if (this.selectedFile) {
      const id = this.generateRandomId();
      const fileUrl = URL.createObjectURL(this.selectedFile);
      this.files.push({ id, name: this.selectedFile.name, file: this.selectedFile, fileUrl });
      this.selectedFile = null;
    }
  }

  editFile(index: number) {
    this.editMode = true;
    this.editIndex = index;
    this.selectedFile = null;  // Reset selected file when editing
  }

  updateFile() {
    if (this.editIndex !== -1) {
      if (this.selectedFile) {
        const fileUrl = URL.createObjectURL(this.selectedFile);
        this.files[this.editIndex] = { id: this.files[this.editIndex].id, name: this.selectedFile.name, file: this.selectedFile, fileUrl };
      }
      this.editMode = false;
      this.editIndex = -1;
      this.selectedFile = null;
    }
  }

  generateRandomId(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  isImage(file: File): boolean {
    return file.type.startsWith('image/');
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


}
