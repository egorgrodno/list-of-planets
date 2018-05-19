import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlanetsModule, PlanetListComponent, PlanetViewComponent } from './planets';

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
