import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type EntityNameType = 'planets';

interface ResponseDataInterface<T> {
  count: number;
  next: string;
  previous: string;
  results: T[];
}

@Injectable({
  providedIn: 'root',
})
export class EntityService {
  private baseUrl = 'https://swapi.co/api/';

  constructor(
    private http: HttpClient,
  ) { }

  private getUrl(name: EntityNameType, filter: string, pageNumber: number) {
    return `${this.baseUrl}${name}/?search=${filter}&page=${pageNumber}&format=json`;
  }

  public listEntities<T>(name: EntityNameType, filter: string, pageNumber: number): Observable<ResponseDataInterface<T>> {
    return this.http.get<ResponseDataInterface<T>>(this.getUrl(name, filter, pageNumber));
  }
}
