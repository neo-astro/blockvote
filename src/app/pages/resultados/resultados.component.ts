import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EleccionVotarService } from 'src/app/shared/services/eleccion-votar.service';
import { ToastServiceService } from 'src/app/shared/services/toast.service.service';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent implements OnInit {
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });



  load:boolean = false
  show = false;
  listaProcesos: any = [];
  searchInit: boolean = false;
  resProcesoResultado: any;
  showProcesoResultado: boolean = false;
  showFormulario: boolean = false;
  resConteoCandidatos: any = null;
  resCandidatos: any;
  tituloProceso: any;

  form: FormGroup;


  idProceso : number = null

  // Options for chart
  data: any = [];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Candidatos';
  showYAxisLabel = true;
  yAxisLabel = '';

  view: any[] = [1000, 500];
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };


  @ViewChild('inputNombreProceso') inputNombreProceso!: ElementRef;
  @ViewChild('inputFecha') inputFecha!: ElementRef;

  constructor(private _http: HttpClient, private _eleccionVotarService: EleccionVotarService, private _toasService: ToastServiceService) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      identificacion: new FormControl('', [Validators.required, Validators.pattern("^[0-9]{10}$")])
    });
  }

  ngOnInit(): void {}

  onSelect(event: any) {
    console.log(event);
  }

  buscarProceso() {
    this.searchInit = false;
    this.show = true;
    this.loadContent();

    const titulo = this.inputNombreProceso.nativeElement.value.trim();
    const fecha = this.inputFecha.nativeElement.value;
    let dato;

    if (titulo && fecha) {
      dato = { Titulo: titulo, Fecha: fecha };
    } else if (titulo) {
      dato = { Titulo: titulo };
    } else {
      this.listaProcesos = [];
      return;
    }

    this._http.post('https://localhost:5001/Resultados/ObtenerProcesos', dato, { headers: this.headers })
      .subscribe(res => {
        this.listaProcesos = res;
        console.log(res);
      });
  }

  resetFecha() {
    this.inputFecha.nativeElement.value = '';
    if (this.inputNombreProceso.nativeElement.value.trim().length === 0) {
      this.listaProcesos = [];
    } else {
      this.buscarProceso();
    }
  }

  loadContent(): void {
    const cardImage = document.getElementsByClassName("card-image")[0] as HTMLElement;
    const title = document.getElementsByClassName("title")[0] as HTMLElement;
    const description = document.getElementsByClassName("description")[0] as HTMLElement;
    const StatusTxt = document.querySelector(".loading-status") as HTMLElement;

    const render = () => {
      title.innerText = "ポルトの街並み";
      description.innerText =
        "ポルトはポルトガル北部の港湾都市。人口約263,000人。リスボンに次ぐポルトガル第二の都市。同国屈指の世界都市であり、ポルト都市圏では、人口は約160万人を数える。";
      title.classList.remove("-loading");
      description.classList.remove("-loading");
      cardImage.classList.remove("-loading");
    };

    const img = new Image();
    img.onload = () => {
      render();
      img.classList.add("image");
      cardImage.appendChild(img);
      StatusTxt.innerText = "読み込み完了！";
    };

    img.onerror = () => {
      render();
    };

    setTimeout(() => {
      this.show = false;
      this.searchInit = true;
    }, 1000);
  }

  obtenerProcesoResultado(id: number, titulo: string, tipoProceso: boolean) {
    this.tituloProceso = titulo;
    if (tipoProceso) {
      this.showProcesoResultado = true;
     
      this._http.get('https://localhost:5001/Resultados/BlockChain/ObtenerTransacciones')
        .subscribe(res => {
          this.resProcesoResultado = res;
          const resultado = this.extractTransactions(this.resProcesoResultado, id);
          this.resConteoCandidatos = this.countVotes(resultado);
          console.log('votos', this.resConteoCandidatos);
        });
      this.yAxisLabel = this.tituloProceso;
    } else {
      this.idProceso= id
      this.showFormulario = true;
    }
  }


  obtenerProcesoResultadPrivado() {


    this.load = true
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

      let datos = {IdProceso:this.idProceso , Email: this.form.get('email').value ,Identificacion : this.form.get('identificacion').value  }
      this._http.post('https://localhost:5001/ResultadosPrivados/', datos,  {headers: headers} )
      .subscribe(res => {
        if (res !=false ){
          this.showProcesoResultado = true
          this.resProcesoResultado = res;
          const resultado = this.extractTransactions(this.resProcesoResultado,  this.idProceso);
          this.resConteoCandidatos = this.countVotes(resultado);
          this.yAxisLabel = this.tituloProceso;
          this.load = false
          }else
          {
            this.load = false
            this._toasService.showNotification("No tiene acceso a este proceso electoral","Cerrar",3000)
          }
        }
        
      );
 
  }



  

  extractTransactions(blockchain: Blockchain, idProceso: number) {
    return blockchain.chain.flatMap(block => 
      block.transactions.filter(transaction => transaction.idProceso === idProceso)
    );
  }

  countVotes(transactions: { proceso: string; voto: string }[]) {
    const voteCounts: { [key: string]: { name: string; value: number } } = {};

    transactions.forEach(transaction => {
      const { voto } = transaction;
      if (voteCounts[voto]) {
        voteCounts[voto].value++;
      } else {
        voteCounts[voto] = { name: voto, value: 1 };
      }
    });

    return Object.values(voteCounts);
  }
}

interface Transaction {
  idProceso: number;
  proceso: string;
  voto: string;
}

interface Block {
  index: number;
  previous_hash: string;
  proof: number;
  timestamp: string;
  transactions: Transaction[];
}

interface Blockchain {
  chain: Block[];
  length: number;
}
