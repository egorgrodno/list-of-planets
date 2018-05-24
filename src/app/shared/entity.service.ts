import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CommonEntity, ResponseDataInterface } from './entity.interface';
import { mapListResponse } from './utils';

export const API_BASE_URL = 'https://swapi.co/api/';

export type EntityNameType = 'planets';

@Injectable({
  providedIn: 'root',
})
export class EntityService {
  private baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  /**
   * Gets an id from given url and entity name
   */
  public extractId(entityName: EntityNameType, url: string): string {
    const re = new RegExp(`${this.baseUrl}${entityName}/(\\d+)/`);
    const match = re.exec(url);

    if (match && match.length > 1) {
      return match[1];
    }

    return null;
  }

  public listEntities<T extends CommonEntity>(
    name: EntityNameType,
    filter: string,
    pageNumber: number,
    pageSize: number,
    createModelFn: (T) => T,
  ): Observable<ResponseDataInterface<T>> {
    const url = `${this.baseUrl}${name}/`;
    const params = new HttpParams({
      fromObject: {
        page: pageNumber.toString(),
        search: filter,
      },
    });

    return this.http
      .get<ResponseDataInterface<T>>(url, { params })
      .pipe(map((res) => mapListResponse(res, createModelFn) as ResponseDataInterface<T>));
  }

  public viewEntity<T extends CommonEntity>(
    name: EntityNameType,
    id: string,
    createModelFn: (T) => T,
  ): Observable<T> {
    const url = `${this.baseUrl}${name}/${id}/`;

    return this.http.get<T>(url).pipe(map((item) => createModelFn(item)));
  }
}
