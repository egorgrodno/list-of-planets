export type UriType = string;
export type IsoDateType = string;

/**
 * Interface that every entity implements
 */
export declare interface CommonEntity {
  created: IsoDateType; // The ISO 8601 date format of the time that this resource was created.
  edited: IsoDateType; // The ISO 8601 date format of the time that this resource was edited.
  url: UriType; // The hypermedia URL of this resource.
}

/**
 * API reponse data interface
 */
export declare interface ResponseDataInterface<T extends CommonEntity> {
  count: number;
  results: T[];
  next?: string;
  previous?: string;
}

/**
 * Mocked response data interface
 */
export declare interface MockResponseDataInterface<T extends CommonEntity> {
  results: T[];
}
