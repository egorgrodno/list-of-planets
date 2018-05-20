import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

export const TABLE_ROW_ANIM = trigger('tableRowAnim', [
  transition('* <=> *', [
    query(':enter', [
      style({ opacity: 0 }),
      stagger(30, [
        animate('150ms ease-out', style({ opacity: 1 })),
      ]),
    ], { optional: true }),
  ]),
]);

export const LOADER_ANIM = trigger('loaderAnim', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('150ms ease-out', style({ opacity: 1 })),
  ]),
]);
