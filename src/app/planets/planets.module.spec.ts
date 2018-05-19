import { PlanetsModule } from './planets.module';

describe('PlanetsModule', () => {
  let planetsModule: PlanetsModule;

  beforeEach(() => {
    planetsModule = new PlanetsModule();
  });

  it('should create an instance', () => {
    expect(planetsModule).toBeTruthy();
  });
});
