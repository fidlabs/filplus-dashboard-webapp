import { useDebouncedCallback } from 'use-debounce';

import { useQueryParams } from 'hooks';
import { Svg } from 'components';
import s from './s.module.css';
import cn from 'classnames';

const inputName = 'search';

export const Search = ({ placeholder = '', widerSearchBar }) => {
  const [query, setQuery] = useQueryParams();

  const handlerSetQuery = (value) => {
    setQuery((params) => ({
      ...params,
      page: null,
      filter: value || null,
    }));
  };

  const debounced = useDebouncedCallback(handlerSetQuery, 400);

  const handlerSubmit = (event) => {
    debounced.cancel();
    const formData = new FormData(event.target);
    event.preventDefault();

    handlerSetQuery(formData.get(inputName));
  };

  return (
    <form
      className={cn(s.wrap, { [s['wider-wrap']]: widerSearchBar })}
      onSubmit={handlerSubmit}
    >
      <input
        type="search"
        name={inputName}
        className={s.input}
        placeholder={placeholder}
        defaultValue={query.filter || ''}
        onChange={(e) => debounced(e.target.value)}
      />
      <button className={s.button}>
        <Svg id="search" className={s.icon} aria-label="Search" />
      </button>
    </form>
  );
};
