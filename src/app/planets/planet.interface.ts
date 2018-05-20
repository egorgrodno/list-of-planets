import { CommonEntity, IsoDateType, UriType } from '../shared/entity.service';

export interface PlanetInterface extends CommonEntity {
  climate: string; // The climate of this planet. Comma-seperated if diverse.
  diameter: string; // The diameter of this planet in kilometers.
  films: UriType[]; // An array of Film URL Resources that this planet has appeared in.
  gravity: string; // A number denoting the gravity of this planet. Where 1 is normal.
  name: string; // The name of this planet.
  orbital_period: string; // The number of standard days it takes for this planet to complete a single orbit of its local star.
  population: string; // The average populationof sentient beings inhabiting this planet.
  residents: UriType[]; // An array of People URL Resources that live on this planet.
  rotation_period: string; // The number of standard hours it takes for this planet to complete a single rotation on its axis.
  surface_water: string; // The percentage of the planet surface that is naturally occuring water or bodies of water.
  terrain: string; // the terrain of this planet. Comma-seperated if diverse.
}
