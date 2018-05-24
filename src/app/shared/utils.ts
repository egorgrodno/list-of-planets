import { CommonEntity, ResponseDataInterface, MockResponseDataInterface } from './entity.interface';

/**
 * Maps response object with square-bracket notation.
 * So after closure compilation response properties
 * are accessisible with dot notation.
 */
export function mapListResponse<T extends CommonEntity>(
  res: ResponseDataInterface<T> | MockResponseDataInterface<T>,
  createModelFn: (T) => T,
): ResponseDataInterface<T> | MockResponseDataInterface<T> {
  const mappedRes = {} as ResponseDataInterface<T> | MockResponseDataInterface<T>;

  /**
   * Skipping 'next' and 'previous' properties because
   * they aren't needed and not used anywhere in the application.
   */
  if ('results' in res) {
    mappedRes.results = res['results'].map((item) => createModelFn(item));
  }
  if ('count' in res) {
    (mappedRes as ResponseDataInterface<T>).count = res['count'];
  }

  return mappedRes;
}
