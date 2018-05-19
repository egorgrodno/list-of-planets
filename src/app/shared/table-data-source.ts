import { BehaviorSubject, Observable, Subscription, fromEvent, merge } from 'rxjs';
import { ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { debounceTime, filter, map, switchMap, tap } from 'rxjs/operators';

import { EntityNameType, EntityService } from './entity.service';

export class TableDataSource<T> {
  private filter$ = new BehaviorSubject<string>('');
  private filterSub: Subscription;
  private paginator: MatPaginator;

  constructor(
    private entityName: EntityNameType,
    private entityService: EntityService,
  ) { }

  public connectPaginator(paginator: MatPaginator): void {
    this.paginator = paginator;
  }

  public connectFilter(el: ElementRef): void {
    this.filterSub = fromEvent<Event>(el.nativeElement, 'input').pipe(
      debounceTime(500),
      map((event) => (event.target as HTMLInputElement).value),
      filter((value) => value !== this.filter$.value)
    ).subscribe((value) => {
      if (this.paginator) {
        this.paginator.pageIndex = 0;
      }
      this.filter$.next(value);
    });
  }

  public connect(): Observable<T[]> {
    const observables = [] as Observable<any>[];

    if (this.paginator) {
      observables.push(this.paginator.page);
    }
    if (this.filterSub) {
      observables.push(this.filter$);
    }

    return merge(...observables)
      .pipe(
        switchMap(() => {
          const filter = this.filter$ ? this.filter$.value : '';
          const pageNumber = this.paginator ? this.paginator.pageIndex + 1 : 1;
          return this.entityService.listEntities<T>(this.entityName, filter, pageNumber)
        }),
        tap((res) => {
          if (this.paginator) {
            this.paginator.length = res.count;
          }
        }),
        map((res) => res.results),
      );
  }

  public disconnect() {
    if (this.filterSub) {
      this.filterSub.unsubscribe();
    }
  }
}
