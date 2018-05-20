import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

const USE_API_DEFAULT = false;

@Injectable({
  providedIn: 'root'
})
export class AppService {
  public title = new Subject<string>();
  public useApi = new BehaviorSubject<boolean>(USE_API_DEFAULT);

  /**
   * Used in planet-view component to detect if last route was an angular route
   */
  public isFirstRoute = true;

  public setTitle(newTitle: string): void {
    this.title.next(newTitle);
  }

  public setUseApi(newUseApi: boolean): void {
    this.useApi.next(newUseApi);
  }

  public onFirstRouteChange(): void {
    console.log('Settings first route to false');
    this.isFirstRoute = false;
  }
}
