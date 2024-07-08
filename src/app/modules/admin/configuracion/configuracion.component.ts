import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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


  ipNodoEliminar:string


  // Modales
  viewModalTiempoForm: boolean = false;
  viewModalAddNodo: boolean = false;
  viewModalDeleteNodo: boolean = false;

 
  @ViewChild('inputTiempo') inputTiempo!: ElementRef;

  constructor(
    private elRef: ElementRef,
    private fb: FormBuilder,
    private toastService: ToastServiceService,
    private administradorService: AdminService,
    private cdr: ChangeDetectorRef
  ) {

    this.temporizadorFormGroup = this.fb.group({
      tiempo: this.fb.control('', Validators.required)
    });

    this.agregarNodoFormGroup = this.fb.group({
      ip: ['', Validators.required]
    });

    this.administradorService.obtenerNodosBlockchain().subscribe(
      res=>{
        this.listaNodos = res as string[]
        console.log(this.listaNodos)
      }
    )


  }

  ngOnInit(): void {}

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
      
      
    this.viewModalTiempoForm = false;
  }







}
