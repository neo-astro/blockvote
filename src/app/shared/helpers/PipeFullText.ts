import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'alphaSpaceOnly'
})
export class PipeFullText implements PipeTransform {
  transform(value: string): string {
    // Aplicar la lógica para permitir solo letras y espacios
    const regex = /^[a-zA-Z\s]*$/;
    return value.replace(regex, '');
  }
}
