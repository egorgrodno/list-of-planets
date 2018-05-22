import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { filter, skip, take } from 'rxjs/operators';

import { AppService } from './shared/app.service';
import { ROUTER_ANIM, RouterAnimStateType } from './app.animations';
import { RouteDataInterface } from './app-routing.module';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: { class: 'mat-typography' },
  animations: [ROUTER_ANIM],
})
export class AppComponent implements OnInit, OnDestroy {
  private titleSub: Subscription;
  private currentPathDepth = -1;
  private currentAnimState: RouterAnimStateType;

  constructor(public appService: AppService, private title: Title, private router: Router) {}

  ngOnInit() {
    this.titleSub = this.appService.title$.subscribe((title) => this.title.setTitle(title));

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd), skip(1), take(1))
      .subscribe(() => this.appService.onFirstRouteChange());
  }

  ngOnDestroy() {
    /** Added just for consistency */
    this.titleSub.unsubscribe();
  }

  public toggleUseApi() {
    this.appService.setUseApi(!this.appService.useApi$.value);
  }

  public getRouterAnimState(route: RouterOutlet): RouterAnimStateType {
    if ((route.activatedRouteData as RouteDataInterface).pathDepth !== this.currentPathDepth) {
      if ((route.activatedRouteData as RouteDataInterface).pathDepth > this.currentPathDepth) {
        this.currentAnimState = 'from-right';
      } else if (
        (route.activatedRouteData as RouteDataInterface).pathDepth < this.currentPathDepth
      ) {
        this.currentAnimState = 'from-left';
      }

      this.currentPathDepth = (route.activatedRouteData as RouteDataInterface).pathDepth;
    }

    return this.currentAnimState;
  }
}
