import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export const API_BASE_URL = 'https://swapi.co/api/';

export type EntityNameType = 'planets';

export type UriType = string;
export type IsoDateType = string;

/**
 * Interface that every entity implements
 */
export interface CommonEntity {
  created: IsoDateType; // The ISO 8601 date format of the time that this resource was created.
  edited: IsoDateType; // The ISO 8601 date format of the time that this resource was edited.
  url: UriType; // The hypermedia URL of this resource.
}

export interface ResponseDataInterface<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}

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
  ): Observable<ResponseDataInterface<T>> {
    const url = `${this.baseUrl}${name}/`;
    const params = new HttpParams({
      fromObject: {
        page: pageNumber.toString(),
        search: filter,
      },
    });

    return this.http.get<ResponseDataInterface<T>>(url, { params });
  }

  public viewEntity<T extends CommonEntity>(name: EntityNameType, id: string): Observable<T> {
    const url = `${this.baseUrl}${name}/${id}/`;

    return this.http.get<T>(url);
  }
}
