export default class Page<T> {
  public constructor(
    public readonly content: T[],
    public readonly empty: boolean,
    public readonly first: boolean,
    public readonly last: boolean,
    public readonly number: number,
    public readonly numberOfElements: number,
    public readonly pageable: Pageable,
    public readonly size: number,
    public readonly sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    },
    public readonly totalElements: number,
    public readonly totalPages: number
  ) {}
}

class Pageable {
  public constructor(
    public readonly offset: number,
    public readonly pageNumber: number,
    public readonly pageSize: number,
    public readonly pages: boolean,
    public readonly sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    }
  ) {}
}
