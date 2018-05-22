import { ActivatedRoute } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { pluck, switchMap, takeUntil, tap } from 'rxjs/operators';

import { AppService } from '../../shared/app.service';
import { EntityService } from '../../shared/entity.service';
import { MockEntityService } from '../../shared/mock-entity.service';
import { PlanetInterface } from '../planet.interface';

export const PLANET_VIEW_ID_PARAM = 'id';

@Component({
  selector: 'app-planet-view',
  templateUrl: './planet-view.component.html',
  styleUrls: ['./planet-view.component.scss'],
  host: { class: 'router-anim-target' },
})
export class PlanetViewComponent implements OnInit, OnDestroy {
  private componentLife$ = new Subject<void>();

  public planetNotFound: boolean;
  public planet: PlanetInterface;
  public title: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private appService: AppService,
    private entityService: EntityService,
    private location: Location,
    private mockEntityService: MockEntityService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.appService.title$
      .pipe(takeUntil(this.componentLife$))
      .subscribe((newTitle) => (this.title = newTitle));

    this.activatedRoute.params
      .pipe(
        tap(() => this.appService.setTitle('Loading planet')),
        tap(() => (this.planetNotFound = false)),
        takeUntil(this.componentLife$),
        pluck(PLANET_VIEW_ID_PARAM),
        switchMap((id) =>
          (this.appService.useApi$.value ? this.entityService : this.mockEntityService).viewEntity(
            'planets',
            id as string,
          ),
        ),
      )
      .subscribe((planet) => this.setPlanet(planet));
  }

  ngOnDestroy() {
    this.componentLife$.next();
    this.componentLife$.complete();
  }

  public setPlanet(newPlanet: PlanetInterface): void {
    if (newPlanet) {
      this.planet = newPlanet;
      this.appService.setTitle(`Planet "${newPlanet.name}"`);
    } else {
      this.planetNotFound = true;
      this.appService.setTitle(`Whoops! Planet not found...`);
    }
  }

  public onBackBtnClick(): void {
    /**
     * Check if current route is the first one
     * And if it is - navigate to planet list page instead of blank page (new tab)
     * I use location.back here so route params (page, search) would remain
     */
    if (this.appService.isFirstRoute) {
      this.router.navigate(['/planets']);
    } else {
      this.location.back();
    }
  }
}
