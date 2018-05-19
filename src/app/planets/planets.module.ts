import { CommonModule } from '@angular/common';
import { MatCardModule, MatInputModule, MatPaginatorModule, MatTableModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PlanetListComponent } from './planet-list/planet-list.component';
import { PlanetViewComponent } from './planet-view/planet-view.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    MatCardModule,
    MatInputModule,
    MatPaginatorModule,
    MatTableModule,
  ],
  declarations: [
    PlanetListComponent,
    PlanetViewComponent,
  ],
})
export class PlanetsModule { }
