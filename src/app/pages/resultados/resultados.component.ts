import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EleccionVotarService } from 'src/app/shared/services/eleccion-votar.service';

@Component({
  selector: 'app-resultados',
  templateUrl: './resultados.component.html',
  styleUrls: ['./resultados.component.css']
})
export class ResultadosComponent  implements OnInit{
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  show=false

  listaProcesos: any = []
  searchInit : boolean=false
  resProcesoResultado: any
  showProcesoResultado:boolean = false
  resConteoCandidatos:any = null
  resCandidatos :any 
  tituloProceso: any



  // options
  data:any = []

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



  @ViewChild('inputNombreProceso') 'inputNombreProceso'! : ElementRef
  @ViewChild('inputFecha') 'inputFecha'! : ElementRef
  constructor(private _http: HttpClient,private  _eleccionVotarService: EleccionVotarService) {
  
   }


  ngOnInit(): void {
  }


  onSelect(event) {
    console.log(event);
  }
 buscarProceso(){
  this.searchInit = false
  this.show = true

  this.loadContent()


  let titulo = this.inputNombreProceso.nativeElement.value
  let fecha = this.inputFecha.nativeElement.value
  let dato

  if(titulo.trim().length >= 0 && fecha.length > 0){
    dato = {Titulo: titulo.trim(), Fecha: fecha }
  }
  if(titulo.trim().length > 0 && fecha.length === 0){
    dato = {Titulo: titulo.trim()}
  }

  if(titulo.length===0 && fecha.length ===0){
    this.listaProcesos = []
  }else{
    this._http.post('https://localhost:5001/Resultados/ObtenerProcesos',dato,{headers:this.headers}).subscribe(
      res =>{
        this.listaProcesos = res
        console.log(res)
         setTimeout(()=>{
   
         },1200)
      }
     )
  }


 }



resetFecha(){
  this.inputFecha.nativeElement.value=''
  if(this.inputNombreProceso.nativeElement.value.trim().length ===0){
    this.listaProcesos = []
  }else{
    this.buscarProceso()
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
    this.show = false
    this.searchInit = true
  }, 1000);
}




obtenerProcesoResultado(id:number,titulo:string){
  this.tituloProceso = titulo
  this.showProcesoResultado = true
  this._eleccionVotarService.getCandidatos({idProceso:id}).subscribe(
    res => {
      this.resCandidatos = res
      console.log(res)
    }
  )
  this._http.get('https://localhost:5001/Resultados/BlockChain/ObtenerTransacciones',).subscribe(
    res =>{
      this.resProcesoResultado = res
      let resultado = this.extractTransactions(this.resProcesoResultado, id);
      this.resConteoCandidatos = this.countVotes(resultado);
      console.log('votos', this.resConteoCandidatos)
    }
   )
   
   this.yAxisLabel = this.tituloProceso


  }

extractTransactions(blockchain: Blockchain, idProceso: number) {
  const extractedTransactions = [];

  for (const block of blockchain.chain) {
    for (const transaction of block.transactions) {
      if (transaction.idProceso === idProceso) {
        extractedTransactions.push({
          proceso: transaction.proceso,
          voto: transaction.voto
        });
      }
    }
  }

  return extractedTransactions;
}



// countVotes(transactions: { proceso: string; voto: string }[]) {
//   const voteCounts: { [key: string]: number } = {};

//   for (const transaction of transactions) {
//     const voto = transaction.voto;
//     if (voteCounts[voto]) {
//       voteCounts[voto]++;
//     } else {
//       voteCounts[voto] = 1;
//     }
//   }

//   return voteCounts;
// }
countVotes(transactions: { proceso: string; voto: string }[]) {
  const voteCounts: { [key: string]: { name: string; value: number } } = {};

  for (const transaction of transactions) {
    const voto = transaction.voto;
    const proceso = transaction.proceso;

    if (voteCounts[voto]) {
      voteCounts[voto].value++;
    } else {
      voteCounts[voto] = { name: voto, value: 1 };
    }
  }

  // Convert the object to an array of objects
  const result = Object.keys(voteCounts).map(key => voteCounts[key]);

  return result;
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