import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';

import { EntityService } from '../../shared/entity.service';
import { PlanetInterface } from '../planet.interface';
import { TableDataSource } from '../../shared/table-data-source';

@Component({
  selector: 'app-planet-list',
  templateUrl: './planet-list.component.html',
  styleUrls: ['./planet-list.component.scss'],
})
export class PlanetListComponent implements OnInit {
  public displayedColumns = ['name', 'population', 'rotation_period', 'orbital_period', 'diameter', 'surface_water'];
  public dataSource: TableDataSource<PlanetInterface>;

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('filter') filter: ElementRef;

  constructor(
    private entityService: EntityService,
  ) { }

  ngOnInit() {
    this.dataSource = new TableDataSource<PlanetInterface>('planets', this.entityService);
    this.dataSource.connectFilter(this.filter);
    this.dataSource.connectPaginator(this.paginator);
  }
}
