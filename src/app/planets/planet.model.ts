import { CommonEntity, IsoDateType, UriType } from '../shared/entity.interface';
import { PlanetInterface } from './planet.interface';

export class PlanetModel implements CommonEntity {
  public climate: string;
  public created: IsoDateType;
  public diameter: string;
  public edited: IsoDateType;
  public films: UriType[];
  public gravity: string;
  public name: string;
  public orbital_period: string;
  public population: string;
  public residents: UriType[];
  public rotation_period: string;
  public surface_water: string;
  public terrain: string;
  public url: UriType;

  private constructor(data: PlanetInterface) {
    this.climate = data['climate'];
    this.created = data['created'];
    this.diameter = data['diameter'];
    this.edited = data['edited'];
    this.films = data['films'];
    this.gravity = data['gravity'];
    this.name = data['name'];
    this.orbital_period = data['orbital_period'];
    this.population = data['population'];
    this.residents = data['residents'];
    this.rotation_period = data['rotation_period'];
    this.surface_water = data['surface_water'];
    this.terrain = data['terrain'];
    this.url = data['url'];
  }

  public static create(data: PlanetInterface): PlanetModel {
    return new PlanetModel(data);
  }
}
