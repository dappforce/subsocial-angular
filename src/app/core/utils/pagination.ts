import {nonEmptyStr} from '@subsocial/utils';
import {tryParseInt} from './num';

export const DEFAULT_FIRST_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export type PaginationQuery = {
  page?: number | string | string[]
  size?: number | string | string[]
}

export type ParsedPaginationQuery = {
  page: number
  size: number
}

export const parsePageQuery = (props: PaginationQuery): ParsedPaginationQuery => {
  let {page = DEFAULT_FIRST_PAGE, size = DEFAULT_PAGE_SIZE} = props;

  if (nonEmptyStr(page)) {
    page = tryParseInt(page, DEFAULT_FIRST_PAGE);
  }

  if (nonEmptyStr(size)) {
    size = tryParseInt(size, DEFAULT_PAGE_SIZE);
  }

  return {
    page: page as number,
    size: size as number
  };
};
