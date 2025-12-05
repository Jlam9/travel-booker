
export class Page<T> {

	content: T[];
	totalElements: number;
	totalPages: number;
	pageNumber: number;
  pageElements: number;
	pageSize: number;
	sort: any;
	first: boolean;
  last: boolean;
	empty: boolean;

  constructor() {
    this.content = [];
  }

}

export function createPage<T>(content: T[], page: number, size: number, total: number): Page<T> {

  return {
    content: content,
    last: (page + 1) * size >= total,
    totalElements: total,
    totalPages: size < 0 ? 1 : Math.ceil(total / size),
    pageNumber: page,
    pageSize: size,
    sort: null,
    first: page === 0,
    pageElements: content.length,
    empty: content.length === 0,
  };

}