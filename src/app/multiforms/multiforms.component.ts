import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder,Validators,FormGroup } from "@angular/forms"

@Component({
  selector: 'app-multiforms',
  templateUrl: './multiforms.component.html',
  styleUrls: ['./multiforms.component.css']
})
export class MultiformsComponent {
  inputExcel=''
  Empregister:FormGroup
  CandidatoFileName: string = '';
  PartidoPoliticoFileName: string = '';

  listaCandidatos : ListaCandidatos[] = []

  @ViewChild('fotoCandidato') inputCandidatoFoto! : ElementRef
  @ViewChild('fotoPartido') inputPartidoFoto! : ElementRef
  @ViewChild('InputFileExcel') inputputFileExcel! : ElementRef

  constructor(private builder: FormBuilder) {
    
    this.Empregister = this.builder.group({
      titulo: this.builder.group({
        tituloName:this.builder.control('',Validators.required),

      }),
      candidatos: this.builder.group({
        nombre:this.builder.control('',Validators.required),
        fotoCandidato:this.builder.control('',[Validators.required, this.fileValidator]),
        nombrePartidoPolitico:this.builder.control('',Validators.required),
        fotoPartidoPolitico:this.builder.control('',Validators.required)

      }),
      votantes: this.builder.group({
        excel:this.builder.control('',Validators.required),
      }),
      configuracion: this.builder.group({
        street:this.builder.control('',Validators.required),
        city:this.builder.control('',Validators.required),
        pin:this.builder.control('',Validators.required)
      })
    });
   }

  isLinear=true;




  get tituloForm(){
    return this.Empregister.get("titulo") as FormGroup;
  }
  get candidatosForm(){
    return this.Empregister.get("candidatos") as FormGroup;
  }
  get votantesForm(){
    return this.Empregister.get("votantes") as FormGroup;
  }
  get configuracionForm(){
    return this.Empregister.get("configuracion") as FormGroup;
  }


  HandleSubmit(){
    if(this.Empregister.valid){
      console.log(this.Empregister.value);
    }
  }

  fileValidator(control: any) {
    const file = control.value;
    if (file) {
      const extension = file.name.split('.').pop().toLowerCase();
      if (extension !== 'png') {
        return {
          fileType: true
        };
      }
    }
    return null;
  }
  
  handleFileInput(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) {
      this.Empregister.get(`candidatos.${controlName}`)?.setValue(file);
    }
  }



  onFileSelected(fileName: string) {
    // this.inputCandidatoFoto.nativeElement.value = fileName
    this.CandidatoFileName = fileName
    alert(this.inputCandidatoFoto.nativeElement.value)
  }
  onFileSelectedExcel(fileName: string) {
    this.inputExcel = fileName
    alert(fileName)
  }
  onFileSelectedPartido(fileName: string) {
    // this.inputPartidoFoto.nativeElement.value = fileName
    this.PartidoPoliticoFileName = fileName
    alert(this.inputPartidoFoto.nativeElement.value)
  }


}


export class ListaCandidatos{
  nombre:string
  nombrePartidoPolitico:string
  fotoCandidato:string
  fotoPartidoPolitico:string
}
