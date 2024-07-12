import { useMemo, useCallback } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

export const useQueryParams = () => {
  const location = useLocation();
  const history = useHistory();

  const spMap = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);

    const spMapInner = {};

    searchParams.forEach((value, key) => {
      if (key.endsWith('[]')) {
        const rawKey = key.substring(0, key.length - 2);
        spMapInner[rawKey] = Array.isArray(spMapInner[rawKey])
          ? [...spMapInner[rawKey], value]
          : [value];
      } else {
        spMapInner[key] = value;
      }
    });

    return spMapInner;
  }, [location.search]);

  const setQueryParams = useCallback(
    (params) => {
      const newParams = new URLSearchParams();

      const newSearchParams =
        typeof params === 'function' ? params(spMap) : params;

      Object.keys(newSearchParams).forEach((key) => {
        const val = newSearchParams[key];
        if (Array.isArray(val)) {
          newParams.set(key, JSON.stringify(val));
        } else if (val !== undefined && val !== null) {
          newParams.set(key, val);
        }
      });

      history.replace({
        search: decodeURI(`?${new URLSearchParams(newParams).toString()}`),
      });
    },
    [spMap, history]
  );

  return [spMap, setQueryParams];
};
