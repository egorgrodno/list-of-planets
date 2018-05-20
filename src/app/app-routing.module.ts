import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PLANET_VIEW_ID_PARAM, PlanetListComponent, PlanetViewComponent, PlanetsModule } from './planets';

const routes: Routes = [
  { path: `planets/:${PLANET_VIEW_ID_PARAM}`, component: PlanetViewComponent },
  { path: 'planets', component: PlanetListComponent },

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
