export interface PaginatedResult<T> {
  data: T[];
  meta: {
    totalItems: number;
    limit: number;
    page: number;
    totalPages: number;
    previousPageUrl: string;
    nextPageUrl: string;
    lastPageUrl: string;
    firstPageUrl: string;
  };
}
