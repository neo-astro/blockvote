import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators,ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminService } from 'src/app/shared/services/admin.service';
import { ToastServiceService } from 'src/app/shared/services/toast.service.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit, AfterViewInit {
  listaNodos: string[];
  eliminarNodoFormGroup: FormGroup;
  agregarNodoFormGroup: FormGroup;
  temporizadorFormGroup: FormGroup;

  tiempoProceso: number;
  containerSize: number;

  ipNodoAdd : string

  ipNodoEliminar:string

  ipError:Boolean=false
  // Modales
  viewModalTiempoForm: boolean = false;
  viewModalAddNodo: boolean = false;
  viewModalDeleteNodo: boolean = false;

  produccion : boolean =false

  res:any


  isHttpActive: boolean = true;
  isHttpsActive: boolean = false;
  msmProtocolo:boolean = false
  usarProtocolo: string = 'http://'

 
  @ViewChild('inputTiempo') inputTiempo!: ElementRef;
  @ViewChild('inputIpNodo') inputIpNodo!: ElementRef<HTMLInputElement>;

  constructor(
    private elRef: ElementRef,
    private fb: FormBuilder,
    private toastService: ToastServiceService,
    private administradorService: AdminService,
    private cdr: ChangeDetectorRef
  ) {

    

  }

  ngOnInit(): void {
    this.temporizadorFormGroup = this.fb.group({
      tiempo: this.fb.control('', Validators.required)
    });

    this.agregarNodoFormGroup = this.fb.group({
      ip: ['',[Validators.required,]]
    });

    this.administradorService.obtenerNodosBlockchain().subscribe(
      res=>{
        this.listaNodos = res as string[]
        console.log(this.listaNodos)
      }
    )

  }

  ngAfterViewInit() {
    this.administradorService.obtenerTiempoProceso().subscribe(
      res => {
        this.tiempoProceso = res.tiempo;
      }
    );
  }

  validateInput(event: any): void {
    const inputValue = event.target.value;
    if (inputValue < 1) {
      event.target.value = 1;
      this.tiempoProceso = 1;
    }
  }


  preventNegative(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }

  handleFocusOut(): void {
    if (this.tiempoProceso === 0 || isNaN(this.tiempoProceso)) {
      this.tiempoProceso = 1;
    }
  }

  enviarTiempo() {
    let tiempo: number = this.inputTiempo.nativeElement.value;
    this.administradorService.cambiarTiempoProcesos(tiempo).subscribe(
      res => {
        this.tiempoProceso  = res as number
      })
      this.toastService.showNotification('Tiempo Actualizado', "cerrar");
      
      
    this.viewModalTiempoForm = false;
  }




  eliminarNodo(ip :string){
    this.viewModalDeleteNodo= true
    this.ipNodoEliminar = ip
    
  }

  enviarEliminarNodo() {
    this.administradorService.removerNodoBlockchain(this.ipNodoEliminar).subscribe(
      res => {
        this.administradorService.obtenerNodosBlockchain().subscribe(
          res => this.listaNodos = res as string[]
        )
      })
      this.toastService.showNotification('Nodo eliminado exitosamente', "cerrar");
    this.viewModalDeleteNodo = false;
  }



  ipPortValidator(value: string): { [key: string]: boolean } | null {
    const ipPortPattern = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9]):([0-9]{1,5})$/;
    if (value && !ipPortPattern.test(value)) {
      return { 'ipPortInvalid': true };
    }
    return null;
  }
  
  validateInputIp(event: any): void {
    const inputValue = event.target.value;
    if (this.ipPortValidator(inputValue)) {
      this.ipError = true
    }else{
      this.ipError = false
    }
  }

  formatIp(event:any):void{
   let patron = /[0-9\.\:]+/
   let valor = event.target.value 
   let input = this.inputIpNodo.nativeElement

   if(patron.test(valor.slice(-1))){
      if(input.value.length == 1 && (valor == '0' || valor == '.')){
          input.value = ''
        }
    }else{
      input.value = input.value.slice(0,-1)
    }
     
  }


  onCheckboxChange(protocol: string): void {
    if (protocol === 'http') {
      this.isHttpActive = true;
      this.usarProtocolo = 'http://'
      this.isHttpsActive = false;
    } else if (protocol === 'https') {
      this.isHttpActive = false;
      this.isHttpsActive = true;
      if(this.produccion){
        this.usarProtocolo = 'https://'
      }else{
        this.usarProtocolo = 'http://'
        this.msmProtocolo= true
        setTimeout(()=>{
          this.isHttpActive = true;
          this.isHttpsActive = false;
          this.msmProtocolo= false          
        }, 3000)

      }
    }
  }
  enviarNodo(){

    if(this.ipError == false && this.inputIpNodo.nativeElement.value.length>0){
      let data = {ipNodo: `${this.usarProtocolo}${this.inputIpNodo.nativeElement.value.trim()}`}
      this.administradorService.addNodoBlockchain(data).subscribe(
        res => {
          this.res = res
          this.toastService.showNotification( this.res.message , 'Cerrar')
          this.administradorService.obtenerNodosBlockchain().subscribe(
            res => this.listaNodos = res as string[]
          )
        })  
        this.viewModalAddNodo = false
    }else{
      this.toastService.showNotification('Asegurece de introducir una direcciôn ip correcta', 'Cerrar')
    }
  }



}
