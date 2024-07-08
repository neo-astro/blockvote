import { Component, ElementRef } from '@angular/core';

@Component({
  selector: 'app-panel-procesos',
  templateUrl: './panel-procesos.component.html',
  styleUrls: ['./panel-procesos.component.css']
})
export class PanelProcesosComponent {
  constructor(private el: ElementRef){}

  ngAfterViewInit() {
    const iframe = this.el.nativeElement.querySelector('iframe');
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    if (iframeDoc) {
      const style = iframeDoc.createElement('style');
      style.textContent = `
        body {
          background-color: #f0f0f0;
          font-family: Arial, sans-serif;
        }
        h1 {
          color: red;
        }
      `;
      iframeDoc.head.appendChild(style);
    }
  }
}
