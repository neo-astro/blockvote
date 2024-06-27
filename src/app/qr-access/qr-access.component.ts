import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';
import { Html5QrcodeScanner } from 'html5-qrcode';

@Component({
  selector: 'app-qr-access',
  templateUrl: './qr-access.component.html',
  styleUrls: ['./qr-access.component.css']
})
export class QrAccessComponent  implements  AfterViewInit{
  @ViewChild('reader') reader: ElementRef;
  public qrResultString: string;
  private html5QrcodeScanner: Html5QrcodeScanner;

  constructor() {
    this.qrResultString = '';
  }




  ngAfterViewInit(): void {

    const config = { fps: 10, qrbox: 250 };
    this.html5QrcodeScanner = new Html5QrcodeScanner(
      'reader', config, /* verbose= */ false);

    this.html5QrcodeScanner.render(this.onScanSuccess.bind(this), this.onScanFailure.bind(this));

  }

  ngOnDestroy(): void {
    if (this.html5QrcodeScanner) {
      this.html5QrcodeScanner.clear(); // Asegúrate de limpiar el escáner
    }
  }

  onScanSuccess(decodedText: string, decodedResult: any): void {
    this.qrResultString = decodedText;
    window.location.href = decodedText; // Redirige al enlace escaneado
  }

  onScanFailure(error: any): void {
    console.warn(`Ocurrio un error = ${error}`);
  }

  clearResult(): void {
    this.qrResultString = '';
  }
}
