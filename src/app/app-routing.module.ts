import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlanetListComponent, PlanetViewComponent, PlanetsModule } from './planets';

const routes: Routes = [
  { path: 'planets', component: PlanetListComponent },
  { path: 'planet/:id', component: PlanetViewComponent },

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
