import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PLANET_VIEW_ID_PARAM, PlanetListComponent, PlanetViewComponent, PlanetsModule } from './planets';

export interface RouteDataInterface {
  pathDepth: number;
}

const routes: Routes = [
  {
    path: `planets/:${PLANET_VIEW_ID_PARAM}`,
    component: PlanetViewComponent,
    data: { pathDepth: 1 } as RouteDataInterface,
  },
  {
    path: 'planets',
    component: PlanetListComponent,
    data: { pathDepth: 0 } as RouteDataInterface,
  },

  { path: '**', redirectTo: '/planets' },
];

@NgModule({
  imports: [
    PlanetsModule,
    RouterModule.forRoot(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule { }
