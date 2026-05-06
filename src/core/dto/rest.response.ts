export class RestResponse<T> {
  status: number;
  results: T;
  type: string;
  pagination?: PaginationResponse;

  constructor(
    status: number,
    results: T,
    type: string,
    pagination?: PaginationResponse,
  ) {
    this.status = status;
    this.results = results;
    this.type = type;
    if (pagination) {
      this.pagination = pagination;
    }
    return this;
  }
}

export class PaginationResponse {
  pages: number[];
  totalElements: number;
  totalPages: number;
  size: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
