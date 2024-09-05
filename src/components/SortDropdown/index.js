import { useState, useRef, useEffect, useMemo } from 'react';
import { usePopper } from 'react-popper';
import outy from 'outy';
import cn from 'classnames';

import { useQueryParams } from 'hooks';
import { Svg } from 'components/Svg';

import s from './s.module.css';

// 1 === asc
// 0 === desc

const defaultOption = { key: null, direction: null, name: 'Default' };

export const SortDropdown = ({ table }) => {
  const [open, setOpen] = useState(false);
  const targetRef = useRef(null);
  const popperRef = useRef(null);
  const outyRef = useRef(null);
  const [query, setQuery] = useQueryParams();

  const options = useMemo(() => {
    const sortableOptions = table.filter((item) => item.sort);
    return sortableOptions.reduce(
      (acc, { sort }) => {
        acc.push({ key: sort.key, direction: 1, name: sort.ascName });
        acc.push({ key: sort.key, direction: 0, name: sort.descName });
        return acc;
      },
      [defaultOption]
    );
  }, [table]);

  const activeSort = useMemo(() => {
    if (query.sort) {
      const pairs = JSON.parse(query.sort)[0];
      const key = pairs[0];
      const direction = Number(pairs[1]);
      const { name } = options.find(
        (item) => item.key === key && item.direction === direction
      );

      return {
        key,
        direction,
        name,
      };
    }
    return defaultOption;
  }, [query.sort]);

  const { styles, attributes, forceUpdate } = usePopper(
    targetRef.current,
    popperRef.current,
    {
      placement: 'bottom',
      strategy: 'absolute',
      modifiers: [
        { name: 'offset', options: { offset: [0, 8] } },
        // { name: 'preventOverflow', options: { padding: 16 } },
        { name: 'flip', enabled: false },
      ],
    }
  );

  useEffect(() => {
    if (forceUpdate) {
      forceUpdate();
    }

    if (open) {
      outyRef.current = outy(
        [targetRef.current, popperRef.current],
        ['click', 'touchstart'],
        () => setOpen(false)
      );
    }

    return () => {
      if (outyRef.current && outyRef.current.remove) {
        outyRef.current.remove();
      }
    };
  }, [open, setOpen]);

  const handlerSort = (key, direction) => () => {
    const clearSort =
      !key ||
      typeof direction !== 'number' ||
      (activeSort.key === key && activeSort.direction === direction);

    setQuery((params) => ({
      ...params,
      page: null,
      sort: clearSort ? null : [[key, direction]],
    }));
    setOpen(false);
  };

  return (
    <div className={s.wrap}>
      <div className={cn(s.buttonBorder, { [s.active]: open })}>
        <button
          type="button"
          className={s.targetBtn}
          ref={targetRef}
          onClick={() => setOpen((isOpen) => !isOpen)}
        >
          Sort by <span className={s.defaultSortName}>{activeSort.name}</span>
          <Svg
            id={open ? 'dropdown-up' : 'dropdown-down'}
            className={s.dropdownIcon}
          />
        </button>
      </div>

      <div
        ref={popperRef}
        style={styles.popper}
        className={cn(s.dropdownWrap, { [s.active]: open })}
        {...attributes.popper}
      >
        {options.map(({ key, direction, name }) => (
          <button
            key={name}
            type="button"
            className={cn(s.dropdownItem, {
              [s.active]:
                key === activeSort.key && direction === activeSort.direction,
            })}
            onClick={handlerSort(key, direction)}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
};
