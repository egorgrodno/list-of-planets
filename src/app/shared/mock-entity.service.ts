import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { delay, map, shareReplay, take } from 'rxjs/operators';

import { API_BASE_URL, EntityNameType } from './entity.service';
import { CommonEntity, MockResponseDataInterface, ResponseDataInterface } from './entity.interface';
import { PlanetInterface } from '../planets/planet.interface';
import { PlanetModel } from '../planets/planet.model';
import { mapListResponse } from './utils';

const DEFAULT_DELAY = 700;

@Injectable({
  providedIn: 'root',
})
export class MockEntityService {
  private planets$: Observable<MockResponseDataInterface<PlanetInterface>>;

  constructor(private http: HttpClient, private location: Location) {
    this.planets$ = this.http
      /** Creating url relative to app base href */
      .get<MockResponseDataInterface<PlanetInterface>>(
        this.location.prepareExternalUrl(`assets/planets.json`),
      )
      /** Caching the data since the data is mocked and it's only ~60 items */
      .pipe(shareReplay(1), map((res) => mapListResponse(res, PlanetModel.create)));
  }

  public listEntities<T extends CommonEntity>(
    name: EntityNameType,
    filter: string,
    pageNumber: number,
    pageSize: number,
    createModelFn: (T) => T,
  ): Observable<ResponseDataInterface<T>> {
    const nameFilterRE = new RegExp(filter, 'i');

    /**
     * Hardcoded planets here since we're only using those.
     * The code is more readable this way.
     */
    return this.planets$.pipe(
      map((res: MockResponseDataInterface<PlanetInterface>) => {
        const filteredResults = res.results.filter((planet) => nameFilterRE.test(planet.name));
        const count = filteredResults.length;
        const sliceFromIndex = (pageNumber - 1) * pageSize;
        const results = filteredResults.slice(sliceFromIndex, sliceFromIndex + pageSize) as any[];
        return { results, count };
      }),
      delay(DEFAULT_DELAY),
    );
  }

  public viewEntity<T extends CommonEntity>(
    name: EntityNameType,
    id: string,
    createModelFn: (T) => T,
  ): Observable<T> {
    const searchForUrl = `${API_BASE_URL}${name}/${id}/`;

    /**
     * No need to map data since planets$ already mapped
     */
    return this.planets$.pipe(
      map((res) => res.results.find((item) => item.url === searchForUrl) as any),
      delay(DEFAULT_DELAY),
    );
  }
}
