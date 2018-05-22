import { Pipe, PipeTransform } from '@angular/core';

/**
 * Appends given string if value is a valid number
 */
@Pipe({
  name: 'appendNum',
})
export class AppendNumPipe implements PipeTransform {
  transform(value: string, appendMultiple: string, appendSingle?: string): string {
    const valueNum = Number(value);

    if (!Number.isFinite(valueNum)) {
      return value;
    }

    if (valueNum === 1 && appendSingle) {
      return `${value}${appendSingle}`;
    }

    return `${value}${appendMultiple}`;
  }
}
