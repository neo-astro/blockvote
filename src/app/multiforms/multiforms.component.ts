import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { MatStepper } from '@angular/material/stepper';
import { CandidatosDto, CandidatosFileDto } from '../upload-file/upload-file.component';
import { ToastServiceService } from '../shared/services/toast.service.service';
import { EleccionVotarService } from '../shared/services/eleccion-votar.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ProcesoService } from '../shared/services/proceso.service';


@Component({
  selector: 'app-multiforms',
  templateUrl: './multiforms.component.html',
  styleUrls: ['./multiforms.component.css'],

})
export class MultiformsComponent  implements OnInit{
  fileCsv: File | null = null;


  idEditar :number = 0
  edit: boolean = false
  inputExcel = ''
  Empregister: FormGroup
  FormRegisterCandidato: FormGroup
  CandidatoFileName: string = '';
  PartidoPoliticoFileName: string = '';
  mostrarImagenCandidato : boolean | null | ArrayBuffer = true 
  mostrarImagenPatidoPolitico : boolean | null | ArrayBuffer = true 
  
  imgPreview : boolean | null | ArrayBuffer = true 
  
  // candidatos: CandidatosDto[] = []
  listCandidatosToJson:CandidatosFileDto[]=[]
  
  outImgCandidato : string | ArrayBuffer
  outImgPartidoPolitico : string | ArrayBuffer

  outImgFileCandidato : File
  outImgFilePartidoPolitico : File
  dataSrcCandidato:string | any  
  dataSrcPartidoPolitico:string | any  
  isLinear = true;

  originalValidators: { [key: string]: any[] } = {};


  // focus
  listadoErroresFormulario = {
    titulo: {
      tituloName: [],
      fechaInicio: [],
      fechaFin: []
    },
    candidatos:{
      nombre:[],
      nombrePartidoPolitico: [],
      fotoCandidato:[],
      fotoPartidoPolitico:[]
    }
  }


  @ViewChild('fotoCandidato') inputCandidatoFoto!: ElementRef;
  @ViewChild('fotoPartido') inputPartidoFoto!: ElementRef;
  @ViewChild('InputFileExcel') inputputFileExcel!: ElementRef;
  @ViewChild('stepper') stepper!: MatStepper;

  form1 :FormBuilder

  constructor(private builder: FormBuilder, 
    private http: HttpClient,
    private toastService:ToastServiceService, private procesoService:ProcesoService) {
    

    this.Empregister = this.builder.group({
      titulo: this.builder.group({
        tituloName: this.builder.control('', [Validators.required,Validators.minLength(5)]),
        fechaInicio: this.builder.control('', Validators.required),
        fechaFin: this.builder.control('', Validators.required),
        resultadoPublico: [false],

      }),
      candidatos: this.builder.group({
        nombre:   this.builder.control('',[Validators.required,Validators.minLength(5)]),
        nombrePartidoPolitico: this.builder.control('',[Validators.required,Validators.minLength(5)]),
        fotoCandidato: this.builder.control('',Validators.required),
        fotoPartidoPolitico: this.builder.control('',Validators.required)
      }),
      votantes: this.builder.group({
        excel: this.builder.control('', Validators.required),
      }),

    });

    this.saveOriginalValidators();

  }

  ngOnInit(): void {

    // this.tituloForm.get('tituloName').setValue(' ')
    // this.candidatosForm.get('nombrePartidoPolitico').setValue(' ')

    
  }

  transition(){
    this.isLinear = true ;
    setInterval(()=>{
      this.isLinear = false ;
    }, 1000)
    
  }
  get tituloForm() {
    return this.Empregister.get("titulo") as FormGroup;
  }
  get candidatosForm() {
    return this.Empregister.get("candidatos") as FormGroup;
  }
  get votantesForm() {
    return this.Empregister.get("votantes") as FormGroup;
  }
  get configuracionForm() {
    return this.Empregister.get("configuracion") as FormGroup;
  }

  HandleSubmit() {
    if (this.Empregister.valid) {
      console.log('IMG form', this.Empregister.value);
    }
  }


  handleFileInput(event: any, controlName: string) {
    const file = event.target.files[0];
    if (file) {
      // this.Empregister.get(`candidatos.${controlName}`)?.setValue(file);
    }
  }

  getEstadoVerImgCandidato(e){
    this.mostrarImagenCandidato = e
  }

  
  getEstadoVerImgPartidoPolitico(e){
    this.mostrarImagenPatidoPolitico = e
  }

  
  // toma los valores que se emiten del nombre img y los agg al FormGroup campo
  onFileSelected(e) {
    alert('nombre recibido' + e.nombre)
    this.CandidatoFileName = e.nombre;
    this.outImgCandidato = e.img
    this.outImgFileCandidato = e.imgFile
    this.dataSrcCandidato = e.dataSrc
  }

  onFileSelectedPartido(e) {
    alert('can recibido' + e.nombre)
    this.PartidoPoliticoFileName = e.nombre;
    this.outImgPartidoPolitico = e.img
    this.outImgFilePartidoPolitico = e.imgFile
    this.dataSrcPartidoPolitico = e.dataSrc
  }

  onFileSelectedExcel(event) {
    if (event.target.files.length > 0) {
      this.fileCsv = event.target.files[0];
    }
    alert(this.fileCsv)
  }


  addCandidato() {
    this.restoreValidatorsToCandidatos()
    if (this.candidatosForm.valid) {
      this.mostrarImagenCandidato = false
      this.mostrarImagenPatidoPolitico = false

      const candidato: CandidatosDto = {
        id: this.listCandidatosToJson.length + 1,
        nombre: this.candidatosForm.value.nombre,
        nombrePartidoPolitico: this.candidatosForm.value.nombrePartidoPolitico,
        fotoCandidato: this.candidatosForm.value.fotoCandidato,
        fotoPartidoPolitico: this.candidatosForm.value.fotoPartidoPolitico,
      };
      
      let itemListCandidatoJson: CandidatosFileDto= {
        ...candidato, 

        imgCandidato : this.outImgCandidato,
        imgPartidoPolitoco:this.outImgPartidoPolitico,

        imgFileCandidato: this.outImgFileCandidato , 
        imgFilePartidoPolitoco:this.outImgFilePartidoPolitico,

        dataSrcCandidato: this.dataSrcCandidato,
        dataSrcPartidoPolitico : this.dataSrcPartidoPolitico
      }

      this.listCandidatosToJson.push(itemListCandidatoJson)
      alert('lista can' + JSON.stringify(this.listCandidatosToJson))
      console.log('datos con img', itemListCandidatoJson)
      this.listCandidatosToJson.push()
      this.candidatosForm.reset();


      this.CandidatoFileName = ''
      this.PartidoPoliticoFileName = ''
      this.inputCandidatoFoto.nativeElement.value = ''
      this.inputPartidoFoto.nativeElement.value = ''
      this.edit = false
      this.toastService.showNotification("Candidato añadio exitosamente","Cerrar", 5000)
    } else{
      this.checkErrors('candidatos','nombre')
      this.checkErrors('candidatos','nombrePartidoPolitico')
      this.toastService.showNotification("Por favor, complete todos los campos del formulario de candidato.","Cerrar", 5000)
    }

   


  }

  delCandidato(id : any){
    alert(id  )
    let res =this.listCandidatosToJson.filter((e)=>e.id != id  )
    this.listCandidatosToJson = res

  }
  btnEdit(id:any){
    this.edit= true
    let res =this.listCandidatosToJson.filter((e)=>e.id == id)
    alert('editar'+ res)
    this.candidatosForm.get('nombre').setValue(res[0]['nombre'])
    this.candidatosForm.get('nombrePartidoPolitico').setValue(res[0]['nombrePartidoPolitico'])
    this.candidatosForm.get('fotoCandidato').setValue(res[0]['fotoCandidato'])
    this.candidatosForm.get('fotoPartidoPolitico').setValue(res[0]['fotoPartidoPolitico'])
    this.idEditar=id  
  }

  editCandidato(){
    this.restoreValidatorsToCandidatos()
    if (this.candidatosForm.valid && this.edit ==true) {

      this.mostrarImagenCandidato = false
      this.mostrarImagenPatidoPolitico = false
      let nuevosValores = { 
        nombre:this.candidatosForm.value.nombre,
        nombrePartidoPolitico: this.candidatosForm.value.nombrePartidoPolitico,
        fotoCandidato: this.candidatosForm.value.fotoCandidato,
        fotoPartidoPolitico: this.candidatosForm.value.fotoPartidoPolitico,
        imgCandidato : this.outImgCandidato ,imgPartidoPolitoco:this.outImgPartidoPolitico 
        , imgFileCandidato: this.outImgFileCandidato , imgFilePartidoPolitoco:this.outImgFilePartidoPolitico
        ,dataSrcCandidato: this.dataSrcCandidato , dataSrcPartidoPolitico : this.dataSrcPartidoPolitico
      };
      
      this.listCandidatosToJson = this.listCandidatosToJson.map(obj => {
        if(obj.id == this.idEditar){
          return {...obj, ...nuevosValores} 
        } else{
          return obj
        }

      })
      console.log()

      this.candidatosForm.reset();


      this.CandidatoFileName = ''
      this.PartidoPoliticoFileName = ''
      this.inputCandidatoFoto.nativeElement.value = ''
      this.inputPartidoFoto.nativeElement.value = ''
      this.edit = false
      this.toastService.showNotification("Actualizado exitosamente","Cerrar", 5000)
      this.idEditar=0
    }else{
      this.checkErrors('candidatos','nombre')
      this.checkErrors('candidatos','nombrePartidoPolitico')
      this.toastService.showNotification("Por favor, complete todos los campos del formulario de candidato.","Cerrar", 5000)
    }



  }

  cancelarEdit(){
    alert('cancelando id' + this.idEditar)
        this.candidatosForm.reset();


      this.CandidatoFileName = ''
      this.PartidoPoliticoFileName = ''
      this.inputCandidatoFoto.nativeElement.value = ''
      this.inputPartidoFoto.nativeElement.value = ''
      this.edit = false
      this.idEditar = 0

    



  }

  goToVotantes() {
    if (this.listCandidatosToJson.length >= 2) {
      this.removeValidatorsFromCandidatos()
      this.stepper.next();
    } else {
      this.toastService.showNotification('Registre al menos 2 candidatos para continuar', 'ok')
    }
  }


 
  validateFormCandidato(control: AbstractControl) {
    if (this.listCandidatosToJson.length >= 2) {
      return { lessThanTwo: true };
    }
    return null;
  }

  esCampoInvalidoGrupo(grupo: string, campo: string): boolean {
    return this.Empregister.get(grupo).get(campo).invalid && (this.Empregister.get(grupo).get(campo).dirty || this.Empregister.get(grupo).get(campo).touched);
  }

  obtenerErrorGrupo(grupo: string, campo: string): string {
    const errores = this.Empregister.get(grupo).get(campo).errors;
    console.log(errores)
    return 'errores'
  }



  checkValidNextStep(grupo: string, campo: string): void {
    this.esCampoInvalidoGrupo(grupo,campo) ? this.obtenerErrorGrupo(grupo,campo): null
  }

  formIsValid(){
    if(this.tituloForm.status == "INVALID"){
      return true
    }else{
      return false
    }
  }
  
 contieneNumero(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const regex = /\d/;
    const valid = regex.test(control.value);
    return valid ? null : { contieneNumero: true };
  };
}



getAllErrors(formGroup: FormGroup, fieldName: string): any {
  const errors = {};
  
  // Obtener el control específico dentro del FormGroup
  const control = formGroup.get(fieldName);

  if (control) {
    const controlErrors = control.errors;
    if (controlErrors != null) {
      errors[fieldName] = controlErrors;
    }

    // Si el control es un FormGroup, llamamos recursivamente
    if (control instanceof FormGroup) {
      const groupErrors = this.getAllErrors(control as FormGroup, fieldName);
      if (Object.keys(groupErrors).length > 0) {
        errors[fieldName] = groupErrors;
      }
    }
  } else {
    console.warn(`El campo ${fieldName} no existe en el FormGroup proporcionado.`);
  }

  return errors;
}


checkErrors(grupo:string,campo:string) {
  this.listadoErroresFormulario[grupo][campo]= []
  const errores = this.getAllErrors(this.Empregister.get(grupo) as FormGroup, campo)[campo];
  if (errores['required'])  this.listadoErroresFormulario[grupo][campo].push('Campo requerido')
  if (errores['minlength']) this.listadoErroresFormulario[grupo][campo].push('Minímo '+ errores['minlength']['requiredLength'])
  console.log(this.listadoErroresFormulario[grupo][campo])
  // console.log(listaErrores)
  // return listaErrores
}

inputText(event: KeyboardEvent) {
  const inputElement = event.target as HTMLInputElement;
  let inputValue = inputElement.value;

  // Aplicar la lógica para permitir solo letras y espacios
  const regex = /^[a-zA-Z\s]*$/;
  if (!regex.test(inputValue)) {
    // Si el valor no cumple con el patrón, elimina el último caracter ingresado
    inputValue = inputValue.slice(0, -1);
    inputElement.value = inputValue;
  }
}


saveOriginalValidators() {
  const candidatosGroup = this.Empregister.get('candidatos') as FormGroup;
  Object.keys(candidatosGroup.controls).forEach(key => {
    this.originalValidators[key] = candidatosGroup.get(key)?.validator 
      ? [candidatosGroup.get(key)?.validator] 
      : [];
  });
}

removeValidatorsFromCandidatos() {
  const candidatosGroup = this.Empregister.get('candidatos') as FormGroup;
  Object.keys(candidatosGroup.controls).forEach(key => {
    candidatosGroup.get(key)?.clearValidators();
    candidatosGroup.get(key)?.updateValueAndValidity();
  });
}

restoreValidatorsToCandidatos() {
  const candidatosGroup = this.Empregister.get('candidatos') as FormGroup;
  Object.keys(candidatosGroup.controls).forEach(key => {
    if (this.originalValidators[key]) {
      candidatosGroup.get(key)?.setValidators(this.originalValidators[key]);
      candidatosGroup.get(key)?.updateValueAndValidity();
    }
  });
}


sendProceso(){

  let tituloForm = {
    Titulo: this.tituloForm.get('tituloName').value,
    FechaInicio: this.tituloForm.get('fechaInicio').value,
    FechaFin: this.tituloForm.get('fechaFin').value,
    ResultadoPublico: this.tituloForm.get('resultadoPublico').value
  }

  let candidatosForm = this.listCandidatosToJson.map( candidato => ({
    nombre: candidato.nombre,
    nombrePartidoPolitico: candidato.nombrePartidoPolitico,
    fotoCandidato: candidato.fotoCandidato,
    fotoPartidoPolitico: candidato.fotoPartidoPolitico,
    fileCandidato: candidato.imgFileCandidato as File,
    filePartidoPolitoco: candidato.imgFilePartidoPolitoco as File
    
  }))

  let formData: FormData = new FormData();

  formData.append('fileCsv', this.fileCsv);
  formData.append('proceso', JSON.stringify(tituloForm));
  formData.append('candidatos', JSON.stringify(candidatosForm));

  this.crearProceso(formData)


}


crearProceso(obj:any){
  this.procesoService.addProceso(obj).subscribe({next:(res:any) => alert(res) })
}


}

