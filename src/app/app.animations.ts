import { animate, group, query, style, transition, trigger } from '@angular/animations';

export type RouterAnimStateType = 'from-left' | 'from-right';

const animDuration = '200ms cubic-bezier(0.25, 0.8, 0.25, 1)';
const leftStyle = style({ transform: 'translateX(-60px)', opacity: 0 });
const rightStyle = style({ transform: 'translateX(60px)', opacity: 0 });

export const ROUTER_ANIM = trigger('routerAnim', [
  transition('* => from-left', [
    group([
      query(':enter', [leftStyle, animate(animDuration)]),
      query(':leave', [animate(animDuration, rightStyle)]),
    ]),
  ]),
  transition('* => from-right', [
    group([
      query(':enter', [rightStyle, animate(animDuration)]),
      query(':leave', [animate(animDuration, leftStyle)]),
    ]),
  ]),
]);
