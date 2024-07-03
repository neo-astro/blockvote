import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-participantes',
  templateUrl: './participantes.component.html',
  styleUrls: ['./participantes.component.css']
})
export class ParticipantesComponent {
  selectedOption: string|null

  recognition: any;

  ngOnInit(): void {
    this.speakText('Elige un objeto: perro o gato');
    setTimeout(()=>{}, 5000)
    this.startListening();
  }
  ngOnDestroy(): void {
    // this.recognition.stop()
    // this.recognition.abort();
  }
  speakText(text: string): void {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    speechSynthesis.speak(utterance);
  }

  startListening(): void {
    this.startListening();
    this.recognition = new (window as any).webkitSpeechRecognition();
    this.recognition.lang = 'es-ES';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
    this.recognition.continuous = true;

    // Ajusta la duración máxima de grabación (en milisegundos)

    this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        this.handleVoiceInput(transcript);
        this.recognition.stop()
        this.recognition.abort();
        
    };

    this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error detected: ' + event.error);
        this.speakText('Error en el reconocimiento de voz. Inténtalo de nuevo.');
        this.recognition.stop()
        setTimeout(()=>{}, 3000)

        this.recognition.start();
    };

    this.recognition.onend = () => {
        if (!this.selectedOption) {
            this.speakText('No existe esa opción. Inténtalo de nuevo. Elige un objeto: perro o gato');
            this.recognition.stop()
            setTimeout(()=>{}, 3000)
                this.recognition.start();
        }
    };

    this.recognition.start();
}


  checkSelect(nombre:string){
    let checkExits =document.getElementById(nombre)  as HTMLInputElement;
    if(checkExits){
      checkExits.checked = true
    }
  }

  handleVoiceInput(transcript: string): void {
    if (transcript === 'perro' || transcript === 'gato') {
      this.selectedOption = transcript;
      this.speakText(`Has elegido ${transcript}`);
      alert('elegiste   ' + transcript )
      this.checkSelect(transcript)
    } else {
      this.selectedOption = null;
      this.speakText('No existe esa opción. Inténtalo de nuevo. Elige un objeto: perro o gato');
      this.recognition.stop()
      setTimeout(()=>{}, 3000)

      this.recognition.start(); // Reinicia el reconocimiento de voz si la opción es inválida
    }
  }

  stopRec(){
    this.recognition.stop()
    this.recognition.abort();

  }
}
