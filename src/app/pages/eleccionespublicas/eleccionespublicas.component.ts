import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { EleccionVotarService } from 'src/app/shared/services/eleccion-votar.service';

@Component({
  selector: 'app-eleccionespublicas',
  templateUrl: './eleccionespublicas.component.html',
  styleUrls: ['./eleccionespublicas.component.css']
})
export class EleccionespublicasComponent {
  listaProcesos: any = [];

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

  idProceso : number = null
  resConteoCandidatos: any = null;
  resCandidatos: any;
  tituloProceso: any;
  searchInit: boolean = false;
  resProcesoResultado: any;
  showProcesoResultado: boolean = false;

  constructor(private _http: HttpClient, private _eleccionVotarService: EleccionVotarService) {
    
 
    this._http.get('https://localhost:5001/Resultados/ObtenerProcesosPublicos',)
    .subscribe(res => {
      this.listaProcesos = res;
      console.log(res)
    });
  }

 
  obtenerProcesoResultado(id: number, titulo: string) {
      this.tituloProceso = titulo;
      this.showProcesoResultado = true;
     
      this._http.get('https://localhost:5001/Resultados/BlockChain/ObtenerTransacciones')
        .subscribe(res => {
          this.resProcesoResultado = res;
          const resultado = this.extractTransactions(this.resProcesoResultado, id);
          this.resConteoCandidatos = this.countVotes(resultado);
          console.log('votos', this.resConteoCandidatos);
        });
      this.yAxisLabel = this.tituloProceso;

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
