import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { skip, take, filter } from 'rxjs/operators';

import { AppService } from './shared/app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: { class: 'mat-typography' },
})
export class AppComponent implements OnInit, OnDestroy {
  private titleSub: Subscription;

  constructor(
    public appService: AppService,
    private title: Title,
    private router: Router,
  ) { }

  ngOnInit() {
    this.titleSub = this.appService.title.subscribe((title) => this.title.setTitle(title));

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      skip(1),
      take(1),
    )
    .subscribe(() => this.appService.onFirstRouteChange());
  }

  ngOnDestroy() {
    /** Added just for consistency */
    this.titleSub.unsubscribe();
  }

  public toggleUseApi() {
    this.appService.setUseApi(!this.appService.useApi.value);
  }
}
