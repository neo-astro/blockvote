import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { MatStepper } from '@angular/material/stepper';
import { ToastServiceService } from '../../shared/services/toast.service.service';
import { EleccionVotarService } from '../../shared/services/eleccion-votar.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { ProcesoService } from '../../shared/services/proceso.service';
import { CandidatosDto, CandidatosFileDto } from '../upload-file/upload-file.component';


@Component({
  selector: 'app-multiforms',
  templateUrl: './multiforms.component.html',
  styleUrls: ['./multiforms.component.css'],

})
export class MultiformsComponent  implements OnInit{

  imagePreviewCandidato: string | ArrayBuffer =''
  imagePreviewPartido: string | ArrayBuffer= ''
  imageNameCandidato: string | null = null; 
  imageNamePartido: string | null = null; 

  mostrarImagenCandidato : boolean | null | ArrayBuffer = false 
  mostrarImagenPatidoPolitico : boolean | null | ArrayBuffer = false 
  

  //edit
  imagePreviewCandidatoEdit : string | ArrayBuffer =''
  imagePreviewPartidoEdit:string| ArrayBuffer =''
 
  imageNameCandidatoEdit:string
  imageNamePartidoEdit:string


  tiempoParaVota : Number = 5
  tiempoMinimoAntesVotar: number=  5

  fileCsv: File | null = null;

  
  fechaComienzaEleccion: string;
  fechaTerminaEleccion : string
  fechaActual:string

  fechaFinal: string 
  

  idEditar :number = 0
  edit: boolean = false
  inputExcel = ''
  Empregister: FormGroup
  FormRegisterCandidato: FormGroup
  CandidatoFileName: string = '';
  PartidoPoliticoFileName: string = '';

  erroresHoraInicio  = ''
  erroresHoraFin     = ''

  horaActual: Date = new Date()

  horaInicio: string
  horaFin: string
  tiempoParaSufragar: string

  HoraVotarApi = 5

  //la que calculo hora hoy + hora api
  horarioDisponibleVotar
  msmHoraDebeIniciar: any = ''
  msmHoraDebeterminar: any = ''


  
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
    },
    votantes :{
      excel:[]
    }

  } 
  horaPorDefectoInicio: string 

  @ViewChild('fotoCandidato') inputCandidatoFoto!: ElementRef;
  @ViewChild('fotoPartido') inputPartidoFoto!: ElementRef;
  @ViewChild('InputFileExcel') inputputFileExcel!: ElementRef;

  @ViewChild('InputFechaInicio') InputFechaInicio!: ElementRef;
  @ViewChild('InputFechaFin') InputFechaFin!:  ElementRef<HTMLInputElement>;


  @ViewChild('inputHoraFin') inputHoraFin!:  ElementRef;
  @ViewChild('inputHoraInicio') inputHoraInicio!:  ElementRef;
  // @ViewChild('imgInput') imgInput: ElementRef<HTMLInputElement>;
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
        nombrePartidoPolitico: this.builder.control('',[Validators.required,Validators.minLength(2)]),
        fotoCandidato: this.builder.control('',Validators.required),
        fotoPartidoPolitico: this.builder.control('',Validators.required)
      }),
      votantes: this.builder.group({
        excel: this.builder.control('', Validators.required),
      }),
      
    });
    
    const today = new Date();
    today.setHours(today.getHours() + this.HoraVotarApi)
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    this.fechaFinal = `${year}-${month}-${day}`;
    this.saveOriginalValidators();

  }

 ngOnInit(){
  setInterval(()=>{
    this.horaActual = new Date()
    let newDate = new Date(this.horaActual);
    this.horarioDisponibleVotar = new Date(newDate)
    this.horarioDisponibleVotar.setHours(newDate.getHours() + this.HoraVotarApi)
  },1000)

 }

 //validar fecha inicio
 onStartDateTimeChange(event: any) {

  if(event.target.value==''){this.fechaActual = null}
  let date = new Date(event.target.value)

  let newDate = new Date(date)
  const year = newDate.getFullYear();
  const month = String(newDate.getMonth() + 1).padStart(2, '0');
  const day = String(newDate.getDate() + 1).padStart(2, '0');

  //vaida fecha y min fecha 
  this.fechaComienzaEleccion = `${year}-${month}-${day}`;
  this.fechaTerminaEleccion= `${year}-${month}-${day}`


  //validar hora inicio
  if(this.InputFechaInicio.nativeElement.value === this.fechaComienzaEleccion ){

    let hours = String(this.horarioDisponibleVotar.getHours()).padStart(2, '0'); 
    let minutes = String(this.horarioDisponibleVotar.getMinutes()).padStart(2, '0'); 

    let tiemporComenzarVotar =`${hours}:${minutes}`
    this.msmHoraDebeIniciar= tiemporComenzarVotar


    this.inputHoraInicio.nativeElement.value= `${hours}:${minutes}`
    let tiempoParaSufragar = `${parseInt(hours) + this.HoraVotarApi}:${minutes}`

    this.inputHoraFin.nativeElement.value= `${parseInt(hours)+this.HoraVotarApi}:${minutes}`
    this.msmHoraDebeterminar= tiempoParaSufragar
  }

}

onEndDateTimeChange(event:any){
  let fechaFin = event.target.value
  this.fechaTerminaEleccion=fechaFin


  let hours = String(this.horarioDisponibleVotar.getHours()).padStart(2, '0'); 
  let minutes = String(this.horarioDisponibleVotar.getMinutes()).padStart(2, '0'); 
  let horaFinConRango =`${parseInt(hours) + this.HoraVotarApi}:${minutes}`

  let horaInicio = this.inputHoraInicio.nativeElement.value


  alert(horaInicio)
  alert(horaFinConRango)

  
  if(fechaFin != this.InputFechaInicio.nativeElement.value){
    alert("ok rango ")
    this.msmHoraDebeterminar = ''
    this.msmHoraDebeIniciar = ''
  } 

  if (fechaFin ===  this.fechaComienzaEleccion){
    let hours = String(this.horarioDisponibleVotar.getHours()).padStart(2, '0'); 
    let minutes = String(this.horarioDisponibleVotar.getMinutes()).padStart(2, '0'); 
    let hora = parseInt(hours) 
    let tiemporComenzarVotar =`${hora}:${minutes}`
    this.msmHoraDebeterminar= tiemporComenzarVotar
  }
  if(fechaFin != this.fechaComienzaEleccion){
    this.msmHoraDebeterminar= ""
    this.msmHoraDebeIniciar = ""
  }
 

}



checkHoraInicio(event:Event){
  let dato:any = event.target as HTMLInputElement
  dato = dato.value
  // alert(dato)
  this.horaInicio = dato
  if(this.fechaTerminaEleccion ===  this.fechaComienzaEleccion){

    

    const hours = String(this.horarioDisponibleVotar.getHours()).padStart(2, '0'); 
    const minutes = String(this.horarioDisponibleVotar.getMinutes()).padStart(2, '0'); 
    let tiempoMinParaVotar =`${hours}:${minutes}`
    

    let horaEntretiempo = this.horaInicio.split(':')
    let tiempoParaVotar =`${ parseInt(horaEntretiempo[0]) + this.HoraVotarApi}:${horaEntretiempo[1]}`

    this.tiempoParaSufragar = tiempoParaVotar


    this.inputHoraFin.nativeElement.value=`${parseInt(horaEntretiempo[0])+ this.HoraVotarApi}:${horaEntretiempo[1]}`

    if (this.compareHoras(dato,tiempoMinParaVotar) == false){
      this.erroresHoraInicio ='Verifique el rango de horas'
      this.msmHoraDebeIniciar=tiempoMinParaVotar
    } else{
      this.erroresHoraInicio = ''
      this.msmHoraDebeIniciar=''
    }


        
    if (this.msmHoraDebeIniciar == '' && this.compareHoras(tiempoParaVotar,this.tiempoParaSufragar)){
      this.msmHoraDebeterminar= ''
    }
  }




}


checkHoraFin(event:Event){
  let dato:any = event.target as HTMLInputElement
  dato = dato.value

  let horaEntretiempo = this.horaInicio.split(':')
  let tiempoParaVotar =`${ parseInt(horaEntretiempo[0]) + 5}:${horaEntretiempo[1]}`

  this.tiempoParaSufragar = tiempoParaVotar
  
  //dias distintos
  if (this.msmHoraDebeIniciar == '' && this.compareHoras(dato,this.tiempoParaSufragar)){
    alert("dias distintos")
    this.msmHoraDebeterminar= ''
  }else{
    this.msmHoraDebeterminar= this.tiempoParaSufragar
  }
}


 compareHoras(HoraInicio: string, HoraPermitidaa: string): boolean {
  // Parsear las horas y minutos de cada tiempo
  const [hours1, minutes1] = HoraInicio.split(':').map(Number);
  const [hours2, minutes2] = HoraPermitidaa.split(':').map(Number);

  // Crear objetos Date ficticios para comparar
  const hora1 = new Date(0, 0, 0, hours1, minutes1);
  const hora2 = new Date(0, 0, 0, hours2, minutes2);

  if (hora1 >= hora2) {
      return true ;
  }else{
    return false
    }

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
  onFileSelected(event:Event):void{
    this.imagePreviewCandidatoEdit = ''
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0 && input.files[0].name != '') {
      this.mostrarImagenCandidato = true
      const file = input.files[0];
      this.imageNameCandidato = file.name
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreviewCandidato = reader.result;

        this.CandidatoFileName   = file.name;
        this.outImgCandidato     = this.imageNameCandidato
        this.outImgFileCandidato = file as File
        this.dataSrcCandidato    = this.imagePreviewCandidato
      }
      reader.readAsDataURL(file);
    }else{
    this.CandidatoFileName   = '';
    this.outImgCandidato     = ''
    this.outImgFileCandidato = null
    this.dataSrcCandidato   = ''
    this.mostrarImagenCandidato = false
  }

}

  onFileSelectedPartido(event:Event): boolean {
    this.imagePreviewPartidoEdit = ''

    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.imageNamePartido = file.name
      const reader = new FileReader();

      this.mostrarImagenPatidoPolitico = true;
      reader.onload = () => {
        this.imagePreviewPartido = reader.result;  
        this.PartidoPoliticoFileName   = file.name;
        this.outImgPartidoPolitico     = this.imageNamePartido
        this.outImgFilePartidoPolitico = file as File
        this.dataSrcPartidoPolitico    = this.imagePreviewPartido
      }
      reader.readAsDataURL(file);
      return true
    }else{
      alert('borro')
      this.PartidoPoliticoFileName   = '';
      this.outImgPartidoPolitico     = ''
      this.outImgFilePartidoPolitico = null
      this.dataSrcPartidoPolitico    = ''
      this.mostrarImagenPatidoPolitico = false
      return false
    }

  }

  onFileSelectedExcel(event) {
    if (event.target.files.length > 0) {
      this.fileCsv = event.target.files[0];
    }
    this.checkErrors('votantes','excel')

  }


  addCandidato() {
    this.restoreValidatorsToCandidatos()
    
    if (this.candidatosForm.valid) {
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
        imgFilePartidoPolitico:this.outImgFilePartidoPolitico,

        dataSrcCandidato: this.dataSrcCandidato,
        dataSrcPartidoPolitico : this.dataSrcPartidoPolitico
      }
 
      this.listCandidatosToJson.push(itemListCandidatoJson)
      console.log('datos con img', itemListCandidatoJson)
      this.candidatosForm.reset();



      this.imagePreviewCandidato =''
      this.imagePreviewPartido = ''
      this.imageNameCandidato = ''; 
      this.imageNamePartido ='';   

      this.PartidoPoliticoFileName = ''
      this.outImgPartidoPolitico   = ''
      this.outImgFilePartidoPolitico = null
      this.dataSrcPartidoPolitico  = ''

      this.CandidatoFileName  = ''
      this.outImgCandidato    = ''
      this.outImgFileCandidato = null
      this.dataSrcCandidato   = ''


      this.inputCandidatoFoto.nativeElement.value = ''
      this.inputPartidoFoto.nativeElement.value = ''


      this.mostrarImagenCandidato = false
      this.mostrarImagenPatidoPolitico = false

      this.edit = false
      this.toastService.showNotification("Candidato añadio exitosamente","Cerrar", 5000)
    } else{
      this.toastService.showNotification("Por favor, complete todos los campos del formulario de candidato.","Cerrar", 5000)
      this.checkErrors('candidatos','nombre')
      this.checkErrors('candidatos','nombrePartidoPolitico')
    }

   


  }

  delCandidato(id : any){
    alert(id  )
    let res =this.listCandidatosToJson.filter((e)=>e.id != id  )
    this.listCandidatosToJson = res

  }
  btnEdit(id:any){
    this.edit= true
    let res  =this.listCandidatosToJson.filter((e:CandidatosFileDto)=> e.id == id )[0]

    this.imagePreviewCandidatoEdit = `${res.dataSrcCandidato}`
    this.imagePreviewPartidoEdit = `${res.dataSrcPartidoPolitico}`

    this.imageNamePartidoEdit = res.fotoPartidoPolitico
    this.imageNameCandidatoEdit = res.fotoCandidato 


    this.candidatosForm.get('nombre').setValue(res.nombre)
    this.candidatosForm.get('nombrePartidoPolitico').setValue(res.nombrePartidoPolitico)

    this.idEditar=id  
  }

  editCandidato(){
    this.removeValidatorsFile()

    if (this.candidatosForm.valid) {

      if(this.imagePreviewCandidato == '' && this.imagePreviewPartido != '')
      {
        alert('no actualiza foto candidato')
        let nuevosValores = { 
          nombre:this.candidatosForm.value.nombre,
          nombrePartidoPolitico: this.candidatosForm.value.nombrePartidoPolitico,

          fotoPartidoPolitico: this.candidatosForm.value.fotoPartidoPolitico,
          imgFilePartidoPolitoco:this.outImgFilePartidoPolitico,
          dataSrcPartidoPolitico : this.dataSrcPartidoPolitico
        };
        this.listCandidatosToJson = this.listCandidatosToJson.map(obj => {
          if(obj.id == this.idEditar){
            return {...obj, ...nuevosValores} 
          } else{
            return obj
          }
  
        })
      }
      
      if(this.imagePreviewCandidato != '' && this.imagePreviewPartido == ''){
        alert('no actualiza foto partido politico')
        let nuevosValores = { 
          nombre:this.candidatosForm.value.nombre,
          nombrePartidoPolitico: this.candidatosForm.value.nombrePartidoPolitico,

          fotoCandidato: this.candidatosForm.value.fotoCandidato,
          imgFileCandidato:this.outImgFileCandidato,
          dataSrcCandidato : this.dataSrcCandidato
        };
        this.listCandidatosToJson = this.listCandidatosToJson.map(obj => {
          if(obj.id == this.idEditar){
            return {...obj, ...nuevosValores} 
          } else{
            return obj
          }
  
        })
      }
      if(this.imagePreviewCandidato != '' && this.imagePreviewPartido != ''){
        alert('ACTUALIZANDO TODO')
        let nuevosValores = { 
          nombre:this.candidatosForm.value.nombre,
          nombrePartidoPolitico: this.candidatosForm.value.nombrePartidoPolitico,

          fotoPartidoPolitico: this.candidatosForm.value.fotoPartidoPolitico,
          imgFilePartidoPolitoco:this.outImgFilePartidoPolitico,
          dataSrcPartidoPolitico : this.dataSrcPartidoPolitico,

          fotoCandidato: this.candidatosForm.value.fotoCandidato,
          imgFileCandidato:this.outImgFileCandidato,
          dataSrcCandidato : this.dataSrcCandidato
        };
        this.listCandidatosToJson = this.listCandidatosToJson.map(obj => {
          if(obj.id == this.idEditar){
            return {...obj, ...nuevosValores} 
          } else{
            return obj
          }
  
        })
      }
      if (this.imagePreviewCandidato == '' && this.imagePreviewPartido == '') {
          alert('editando todo nombres')
        let nuevosValores = { 
          nombre:this.candidatosForm.value.nombre,
          nombrePartidoPolitico: this.candidatosForm.value.nombrePartidoPolitico,
        };
        
        this.listCandidatosToJson = this.listCandidatosToJson.map(obj => {
          if(obj.id == this.idEditar){
            return {...obj, ...nuevosValores} 
          } else{
            return obj
          }
  
        })
      }

      this.imagePreviewPartidoEdit = ''
      this.imagePreviewCandidatoEdit = ''

      this.candidatosForm.reset();

      this.mostrarImagenCandidato = false
      this.mostrarImagenPatidoPolitico = false

      this.imageNameCandidatoEdit= ''
      this.imageNamePartidoEdit= ''

      this.CandidatoFileName = ''
      this.PartidoPoliticoFileName = ''
      this.inputCandidatoFoto.nativeElement.value = ''
      this.inputPartidoFoto.nativeElement.value = ''
      this.edit = false
      this.toastService.showNotification("Actualizado exitosamente","Cerrar", 5000)
      this.idEditar=0
    }else{
      this.toastService.showNotification("Por favor, complete todos los campos del formulario de candidato.","Cerrar", 5000)
      this.checkErrors('candidatos','nombre')
      this.checkErrors('candidatos','nombrePartidoPolitico')
    }



  }

  cancelarEdit(){
      this.candidatosForm.reset();

      this.imagePreviewPartidoEdit = ''
      this.imagePreviewCandidatoEdit= ''
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
      if(this.msmHoraDebeIniciar != '' && this.msmHoraDebeterminar != ''){
        console.log('todo valido')
      }
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
  if (errores['minlength']) this.listadoErroresFormulario[grupo][campo].push('Minímo '+ errores['minlength']['requiredLength']+' caracteres' )
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

removeValidatorsFile() {
  const candidatosGroup = this.Empregister.get('candidatos') as FormGroup;
  candidatosGroup.get('fotoCandidato')?.clearValidators();
  candidatosGroup.get('fotoCandidato')?.updateValueAndValidity();
  candidatosGroup.get('fotoPartidoPolitico')?.clearValidators();
   candidatosGroup.get('fotoPartidoPolitico')?.updateValueAndValidity();
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

combinarFechaYHora(fecha: Date, hora: Date): Date {
  // Extraer los componentes de fecha
  const año = fecha.getFullYear();
  const mes = fecha.getMonth();
  const día = fecha.getDate();

  // Extraer los componentes de hora
  const horas = hora.getHours();
  const minutos = hora.getMinutes();
  const segundos = hora.getSeconds();
  const milisegundos = hora.getMilliseconds();

  // Crear una nueva instancia de Date combinando fecha y hora
  const fechaCombinada = new Date(año, mes, día, horas, minutos, segundos, milisegundos);
  return fechaCombinada;
}
sendProceso(){
  
  if(this.votantesForm.valid){
    

      let horaInicio = this.inputHoraInicio.nativeElement.value
      let horaFin = this.inputHoraFin.nativeElement.value
    
      let fechaHoraInicio = this.combinarFechaYHora(this.tituloForm.get('fechaInicio').value, horaInicio) 
      let fechaHoraFin = this.combinarFechaYHora(this.tituloForm.get('fechaFin').value, horaFin) 
     alert(fechaHoraInicio)
     alert(fechaHoraFin)
      const formData = new FormData();
    
      // Agregar datos del título al FormData
      formData.append('Titulo', `${fechaHoraFin}`);
      formData.append('FechaInicio', `${fechaHoraInicio}` );
      formData.append('FechaFin', this.tituloForm.get('fechaFin').value);
      formData.append('ResultadoPublico', this.tituloForm.get('resultadoPublico').value);
      console.log(this.listCandidatosToJson)
      // Agregar datos de los candidatos al FormData
      this.listCandidatosToJson.forEach((candidato, index) => {
        formData.append(`candidatos[${index}].Nombre`, candidato.nombre);
        formData.append(`candidatos[${index}].NombrePartidoPolitico`, candidato.nombrePartidoPolitico);
        formData.append(`candidatos[${index}].FotoCandidato`, candidato.fotoCandidato);
        formData.append(`candidatos[${index}].FotoPartidoPolitico`, candidato.fotoPartidoPolitico);
        formData.append(`candidatos[${index}].FileCandidato`,  candidato.imgFileCandidato as File);
        formData.append(`candidatos[${index}].FilePartidoPolitico`, candidato.imgFilePartidoPolitico  as File);
      });
    
      formData.append('fileCsv', this.fileCsv);
    
    
    
      // fetch('https://localhost:5001/api/proceso/crear',)
    
      // const headers = new HttpHeaders({
      //   'Content-Type': 'multipart/form-data'  
      // });
      const opcionesFetch: RequestInit = {
        method: 'POST',
        body: formData,
        // No es necesario configurar manualmente el Content-Type con FormData
      };
      
      fetch('https://localhost:5001/api/proceso/crear', opcionesFetch)
        .then(response => {
          console.log(response)
        })
        .catch(error => {
          console.error('Error en la solicitud fetch:', error);
          // Manejar errores de la solicitud fetch
        });

  }else{
    this.checkErrors('votantes','excel')
    this.toastService.showNotification("Por favor, sube el documento.","Cerrar", 2500)
 
  }
  
  // this.http.post("https://localhost:5001/api/proceso/crear", formData)

}


crearProceso(obj:any){
  this.procesoService.addProceso(obj).subscribe({next:(res:any) => alert(res) })
}







}
export class ProcesoDto{
  Titulo:string
  FechaInicio:string
  FechaFin:string
  ResultadoPublico:string
}

export class Candidatos {
  Nombre:string
  NombrePartidoPolitico
  FotoCandidato
  FotoPartidoPolitico
  FilePartidoPolitoco
  FileCandidato
}