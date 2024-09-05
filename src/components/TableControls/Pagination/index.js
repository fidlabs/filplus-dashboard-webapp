import { Link } from 'react-router-dom';
import cn from 'classnames';
import { useQueryParams } from 'hooks';
import { Svg } from 'components';
import { limitDefaultValue, limitStorageName } from 'constant';

import s from './s.module.css';

function pagination(current, last, delta = 1) {
  const left = current - delta;
  const right = current + delta + 1;
  const range = [];
  const rangeWithDots = [];
  let l;

  if (last < 5) {
    return Array.from({ length: last }, (v, k) => k + 1);
  }

  range.push(1);
  for (let i = current - delta; i <= current + delta; i++) {
    if (i >= left && i < right && i < last && i > 1) {
      range.push(i);
    }
  }
  range.push(last);

  range.forEach((i) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push(null);
      }
    }
    rangeWithDots.push(i);
    l = i;
  });

  return rangeWithDots;
}

function generateLinkUrl(page, paramName) {
  return (location) => {
    const queryParams = new URLSearchParams(location.search);

    if (page === 1) {
      queryParams.delete(paramName);
    } else {
      queryParams.set(paramName, String(page));
    }

    return `${location.pathname}?${queryParams.toString()}`;
  };
}

export function Pagination({ totalItems, paramName = 'page' }) {
  const [query] = useQueryParams();
  let limit = limitDefaultValue;
  const userLimit = window.localStorage.getItem(limitStorageName);
  if (userLimit) {
    limit = Number(userLimit);
  }
  if (query.limit) {
    limit = Number(query.limit);
  }

  const currentPage = query.page ? Number(query.page) : 1;

  const totalPages = Math.ceil(totalItems / limit);
  const paginationList = pagination(currentPage, totalPages);

  return (
    <ol className={s.pagination}>
      <li>
        <Link
          to={generateLinkUrl(currentPage - 1, paramName)}
          className={s.arrowLink}
          disabled={currentPage <= 1}
        >
          <Svg id="pagination-left" aria-label="Previous page" />
        </Link>
      </li>
      {paginationList.map((item, idx) => {
        if (item === 0) return null;

        return (
          <li key={idx}>
            <Link
              to={generateLinkUrl(item, paramName)}
              className={cn(s.pageLink, {
                [s.pageLinkActive]: currentPage === item,
              })}
              disabled={!item}
            >
              {item || '...'}
            </Link>
          </li>
        );
      })}
      <li>
        <Link
          to={generateLinkUrl(currentPage + 1, paramName)}
          className={s.arrowLink}
          disabled={currentPage >= totalPages}
        >
          <Svg id="pagination-right" aria-label="Next page" />
        </Link>
      </li>
    </ol>
  );
}
