import { Pipe, PipeTransform } from '@angular/core';

const MIN_NOTATION_NUM = 10000;

/**
 * Transform large numbers (>= MIN_NOTATION_NUM) to more readable scientific notation
 */
@Pipe({
  name: 'scientificNotation',
})
export class ScientificNotationPipe implements PipeTransform {
  private re = /0+$/;

  transform(value: string): string {
    const valueNum = Number(value);

    if (!Number.isFinite(valueNum) || valueNum < MIN_NOTATION_NUM) {
      return value;
    }

    const match = value.match(this.re);
    if (!match || !match[0]) {
      return value;
    }

    return valueNum.toPrecision(value.length - match[0].length);
  }
}
