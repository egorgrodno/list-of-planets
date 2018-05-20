import { BehaviorSubject, Observable, Subscription, fromEvent, merge } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
import { ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { debounceTime, filter, map, switchMap, tap } from 'rxjs/operators';

import { CommonEntity, EntityNameType, EntityService } from './entity.service';
import { MockEntityService } from './mock-entity.service';

const DEBOUNCE_TIME_DEFAULT = 350;

export interface DataSourceInputDataInterface {
  filter: string;
  pageNumber: number;
  pageSize: number;
}

export class TableDataSource<T extends CommonEntity> extends DataSource<T> {
  private filter$: BehaviorSubject<string>;
  private filterSub: Subscription;

  public onInput: Observable<DataSourceInputDataInterface>;
  public isLoading$ = new BehaviorSubject<boolean>(true);

  constructor(
    private entityName: EntityNameType,
    private entityService: EntityService | MockEntityService,
    private paginator: MatPaginator,
    private filterEl: ElementRef,
    private inputDataDefault: DataSourceInputDataInterface,
  ) {
    super();
    /**
     * Setup default values
     */
    this.filter$ = new BehaviorSubject<string>(inputDataDefault.filter);
    this.paginator.pageIndex = inputDataDefault.pageNumber - 1;
    this.paginator.pageSize = inputDataDefault.pageSize;

    /**
     * Subscribe to input element (filter)
     */
    this.filterSub = fromEvent<Event>(this.filterEl.nativeElement, 'input').pipe(
      debounceTime(DEBOUNCE_TIME_DEFAULT),
      map((event) => (event.target as HTMLInputElement).value.trim()),
      filter((value) => value !== this.filter$.value),
    ).subscribe((value) => {
      this.paginator.pageIndex = 0;
      this.filter$.next(value);
    });

    /**
     * Create public observable
     * Component subscribes to this variable to update it's route path
     */
    this.onInput = merge(this.paginator.page, this.filter$)
      .pipe(
        map(() => {
          return {
            filter: this.filter$.value,
            pageNumber: this.paginator.pageIndex + 1,
            pageSize: this.paginator.pageSize,
          };
        }),
      );
  }

  /**
   * mat-table hook (subscribes on init)
   */
  public connect(): Observable<T[]> {
    return this.onInput.pipe(
        tap((res) => this.isLoading$.next(true)),
        switchMap((inputData) => this.entityService
          .listEntities<T>(this.entityName, inputData.filter, inputData.pageNumber, inputData.pageSize)),
        tap((res) => this.paginator.length = res.count),
        tap((res) => this.isLoading$.next(false)),
        map((res) => res.results),
      );
  }

  /**
   * mat-table hook (unsubscribes on destroy)
   */
  public disconnect() {
    this.filterSub.unsubscribe();
    this.isLoading$.complete();
  }
}
