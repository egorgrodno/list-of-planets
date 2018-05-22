import { CommonModule } from '@angular/common';
import { MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, MatTableModule } from '@angular/material';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppendNumPipe } from './pipes/append-num.pipe';
import { PlanetListComponent } from './planet-list/planet-list.component';
import { PlanetViewComponent } from './planet-view/planet-view.component';
import { ScientificNotationPipe } from './pipes/scientific-notation.pipe';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ],
  declarations: [
    AppendNumPipe,
    PlanetListComponent,
    PlanetViewComponent,
    ScientificNotationPipe,
  ],
})
export class PlanetsModule { }
