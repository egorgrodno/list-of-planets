import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { delay, map, shareReplay, take } from 'rxjs/operators';

import { API_BASE_URL, CommonEntity, EntityNameType, ResponseDataInterface } from './entity.service';
import { PlanetInterface } from '../planets/planet.interface';

const DEFAULT_DELAY = 700;

interface MockResponseDataInterface<T> {
  results: T[];
}

@Injectable({
  providedIn: 'root',
})
export class MockEntityService {
  private planets$: Observable<MockResponseDataInterface<PlanetInterface>>;

  constructor(
    private http: HttpClient,
    private location: Location,
  ) {
    this.planets$ = this.http
      /** Creating url relative to app base href */
      .get<MockResponseDataInterface<PlanetInterface>>(this.location.prepareExternalUrl(`assets/planets.json`))
      /** Caching the data since the data is mocked and it's only ~60 items */
      .pipe(shareReplay(1));
  }

  private getMockedSource<T extends CommonEntity>(name: EntityNameType): Observable<MockResponseDataInterface<T>> {
    if (name === 'planets') {
      return this.planets$ as any;
    }
  }

  public listEntities<T extends CommonEntity>(name: EntityNameType, filter: string, pageNumber: number, pageSize: number): Observable<ResponseDataInterface<T>> {
    const nameFilterRE = new RegExp(filter, 'i');

    return this.planets$.pipe(
      map((res) => {
        const filteredResults = res.results.filter((planet) => nameFilterRE.test(planet.name));
        const count = filteredResults.length;
        const sliceFromIndex = (pageNumber - 1) * pageSize;
        const results = filteredResults.slice(sliceFromIndex, sliceFromIndex + pageSize) as any[];
        return { results, count, next: null, previous: null };
      }),
      delay(DEFAULT_DELAY),
    );
  }

  public viewEntity<T extends CommonEntity>(name: EntityNameType, id: string): Observable<T> {
    const searchForUrl = `${API_BASE_URL}${name}/${id}/`;

    return this.getMockedSource<T>(name).pipe(
      map((res) => res.results.find((item) => item.url === searchForUrl) as any),
      delay(DEFAULT_DELAY),
    );
  }
}
