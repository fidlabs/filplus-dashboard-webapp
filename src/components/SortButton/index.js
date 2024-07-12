import { useMemo } from 'react';
import cn from 'classnames';

import { useQueryParams } from 'hooks/queryParams';
import { Svg } from 'components/Svg';
import s from './s.module.css';

// 1 === asc
// 0 === desc

export const SortButton = ({ children, sortKey }) => {
  const [query, setQuery] = useQueryParams();

  const activeSort = useMemo(() => {
    if (query.sort) {
      const pairs = JSON.parse(query.sort)[0];
      return {
        key: pairs[0],
        direction: Number(pairs[1]),
      };
    }
    return {
      key: null,
      direction: null,
    };
  }, [query.sort]);

  const handlerSort = (direction) => {
    const clearSort =
      activeSort.key === sortKey && activeSort.direction === direction;
    setQuery((params) => ({
      ...params,
      page: null,
      sort: clearSort ? null : [[sortKey, direction]],
    }));
  };

  return (
    <div className={s.wrap}>
      <span>{children}</span>
      <div className={s.buttonsWrap}>
        <button
          className={cn(s.button, {
            [s.active]:
              activeSort.key === sortKey && activeSort.direction === 1,
          })}
          type="button"
          onClick={() => handlerSort(1)}
        >
          <Svg
            id="sort-asc"
            width={6}
            height={4}
            className={s.icon}
            aria-label="Sort by Asc"
          />
        </button>
        <button
          className={cn(s.button, {
            [s.active]:
              activeSort.key === sortKey && activeSort.direction === 0,
          })}
          type="button"
          onClick={() => handlerSort(0)}
        >
          <Svg
            id="sort-desc"
            width={6}
            height={4}
            className={s.icon}
            aria-label="Sort by Desc"
          />
        </button>
      </div>
    </div>
  );
};
