import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatTable } from '@angular/material';
import { Subscription } from 'rxjs';
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

import { AppService } from '../../shared/app.service';
import { DataSourceInputDataInterface, TableDataSource } from '../../shared/table-data-source';
import { EntityService } from '../../shared/entity.service';
import { MockEntityService } from '../../shared/mock-entity.service';
import { PlanetModel } from '../planet.model';

const API_PAGE_SIZE_OPTIONS = [10];
const MOCK_DATA_PAGE_SIZE_OPTIONS = [5, 10, 25, 100];
const FILTER_PROP_NAME = 'f';
const PAGE_NUMBER_PROP_NAME = 'pn';
const PAGE_SIZE_PROP_NAME = 'ps';

@Component({
  selector: 'app-planet-list',
  templateUrl: './planet-list.component.html',
  styleUrls: ['./planet-list.component.scss'],
  host: { class: 'router-anim-target' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('tableRowAnim', [
      transition('* <=> *', [
        query(
          ':enter',
          [style({ opacity: 0 }), stagger(30, [animate('150ms ease-out', style({ opacity: 1 }))])],
          { optional: true },
        ),
      ]),
    ]),
    trigger('loaderAnim', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms ease-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class PlanetListComponent implements OnInit, OnDestroy {
  public displayedColumns = [
    'name',
    'population',
    'rotation_period',
    'orbital_period',
    'diameter',
    'surface_water',
  ];
  public dataSource: TableDataSource<PlanetModel>;
  public pageSizeOptions: number[];

  private useApiSub: Subscription;
  private dataSourceInputSub: Subscription;

  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('filter') filterEl: ElementRef;

  constructor(
    private activatedRoute: ActivatedRoute,
    private appService: AppService,
    private entityService: EntityService,
    private mockEntityService: MockEntityService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.appService.setTitle('Planet Search');

    this.useApiSub = this.appService.useApi$.subscribe((useApi) => {
      if (this.dataSourceInputSub) {
        this.dataSourceInputSub.unsubscribe();
      }

      this.pageSizeOptions = useApi ? API_PAGE_SIZE_OPTIONS : MOCK_DATA_PAGE_SIZE_OPTIONS;

      this.dataSource = new TableDataSource<PlanetModel>(
        'planets',
        useApi ? this.entityService : this.mockEntityService,
        this.paginator,
        this.filterEl,
        this.mapParamsToInputData(this.activatedRoute.snapshot.params),
        PlanetModel.create,
      );

      this.dataSourceInputSub = this.dataSource.onInput.subscribe((inputData) =>
        this.router.navigate(['/planets', this.mapInputDataToParams(inputData)]),
      );
    });
  }

  ngOnDestroy() {
    this.useApiSub.unsubscribe();
    this.dataSourceInputSub.unsubscribe();
  }

  public getPlanetId(planet: PlanetModel): string {
    return this.entityService.extractId('planets', planet.url);
  }

  /**
   * Accepts params from url, validates them and creates inputData: DataSourceInputDataInterface
   */
  public mapParamsToInputData(params: Params): DataSourceInputDataInterface {
    const dataSourceInputData = {
      filter: '',
      pageNumber: 1,
      pageSize: 10,
    };

    if (FILTER_PROP_NAME in params) {
      dataSourceInputData.filter = params[FILTER_PROP_NAME].trim();
    }
    if (PAGE_NUMBER_PROP_NAME in params) {
      const pageNumber = Number(params[PAGE_NUMBER_PROP_NAME]);
      if (Number.isFinite(pageNumber) && pageNumber > 0) {
        dataSourceInputData.pageNumber = pageNumber;
      }
    }
    if (PAGE_SIZE_PROP_NAME in params) {
      const pageSize = Number(params[PAGE_SIZE_PROP_NAME]);
      if (
        Number.isFinite(pageSize) &&
        this.pageSizeOptions.some((pageSizeOption) => pageSizeOption === pageSize)
      ) {
        dataSourceInputData.pageSize = pageSize;
      }
    }

    return dataSourceInputData;
  }

  /**
   * Accepts inputData: DataSourceInputDataInterface and transforms it to params object
   * This transformation is necessary, since closure compiler will rename the props
   */
  public mapInputDataToParams(inputData: DataSourceInputDataInterface): object {
    return {
      [FILTER_PROP_NAME]: inputData.filter,
      [PAGE_NUMBER_PROP_NAME]: inputData.pageNumber,
      [PAGE_SIZE_PROP_NAME]: inputData.pageSize,
    };
  }

  public getMinHeight(): string {
    if (this.paginator.pageSize <= 10) {
      return `${this.paginator.pageSize * 49 + 57}px`;
    }

    return '0px';
  }
}
