import { useState, useRef, useEffect } from 'react';
import { usePopper } from 'react-popper';
import outy from 'outy';
import cn from 'classnames';

import { useQueryParams } from 'hooks/queryParams';

import { Svg } from 'components/Svg';
import {
  limitDefaultOptions,
  limitDefaultValue,
  limitStorageName,
} from 'constant';
import s from './s.module.css';

export const ItemsCount = () => {
  const [open, setOpen] = useState(false);
  const [limit, setLimit] = useState(limitDefaultValue);
  const targetRef = useRef(null);
  const popperRef = useRef(null);
  const outyRef = useRef(null);
  const [query, setQuery] = useQueryParams();

  const { styles, attributes, forceUpdate } = usePopper(
    targetRef.current,
    popperRef.current,
    {
      placement: 'bottom',
      strategy: 'absolute',
      modifiers: [{ name: 'offset', options: { offset: [0, 8] } }],
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

  useEffect(() => {
    const userLimit = localStorage.getItem(limitStorageName);

    if (userLimit) {
      setLimit(Number(userLimit));
    }
  }, []);

  const handlerChange = (newLimit) => {
    setQuery((params) => ({
      ...params,
      limit: String(newLimit),
      page: null,
    }));
    setLimit(newLimit);
    localStorage.setItem(limitStorageName, String(newLimit));
    setOpen(false);
  };

  return (
    <div className={s.wrap}>
      <span>View</span>
      <div className={cn(s.buttonBorder, { [s.active]: open })}>
        <button
          type="button"
          className={s.targetBtn}
          ref={targetRef}
          onClick={() => setOpen((isOpen) => !isOpen)}
        >
          <span>{limit}</span>
          <Svg
            id={open ? 'dropdown-up' : 'dropdown-down'}
            className={s.dropdownIcon}
          />
        </button>
      </div>
      <span>items per page</span>

      <div
        ref={popperRef}
        style={styles.popper}
        className={cn(s.dropdownWrap, { [s.active]: open })}
        {...attributes.popper}
      >
        {limitDefaultOptions.map((option) => (
          <button
            key={option}
            type="button"
            className={cn(s.dropdownItem, {
              [s.active]: option === limit,
            })}
            onClick={() => handlerChange(option)}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};
