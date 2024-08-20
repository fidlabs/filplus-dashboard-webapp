import { useEffect, useState } from 'react';

import { useQueryParams } from 'hooks/queryParams';
import { api } from 'utils/api';
import { limitDefaultValue, limitStorageName } from 'constant';

const defaultTableState = {
  results: {
    count: 0,
    data: [],
  },
  loading: false,
  loaded: false,
};

export const useFetchTable = (
  url,
  customDependencies = [],
  customQueryParams = () => null
) => {
  const [data, setData] = useState(defaultTableState);
  const [query] = useQueryParams();

  useEffect(() => {
    setData({
      ...defaultTableState,
      loading: true,
    });

    const abortController = new AbortController();
    const queryParams = new URLSearchParams();
    const userLimit = localStorage.getItem(limitStorageName);

    queryParams.set(
      'limit',
      query.limit || userLimit || String(limitDefaultValue)
    );
    queryParams.set('page', query.page || '1');
    if (query.sort) queryParams.set('sort', query.sort);
    if (query.filter) queryParams.set('filter', query.filter);
    customQueryParams(queryParams, customDependencies);

    const apiUrl = `${url}?${queryParams.toString()}`;

    api(apiUrl, {
      signal: abortController.signal,
    })
      .then((results) => {
        setData({
          ...defaultTableState,
          results,
          loaded: true,
        });
      })
      .catch((e) => {
        console.error(e);
        setData({
          ...defaultTableState,
          loaded: true,
        });
      });

    return function cancel() {
      abortController.abort();
    };
  }, [
    url,
    query.limit,
    query.page,
    query.sort,
    query.filter,
    ...customDependencies,
  ]);

  return [data.results, { loading: data.loading, loaded: data.loaded }];
};

const defaultState = {
  results: {},
  loading: false,
  loaded: false,
  error: undefined
};

export const useFetch = (url) => {
  const [data, setData] = useState(defaultState);

  useEffect(() => {
    setData({
      ...defaultState,
      loading: true,
    });

    const abortController = new AbortController();

    api(url, { signal: abortController.signal })
      .then((results) => {
        setData({
          ...defaultState,
          results,
          loaded: true,
        });
      })
      .catch((e) => {
        console.error(e);
        setData({
          ...defaultState,
          loaded: true,
          error: e.statusCode ?? 500
        });
      });

    return function cancel() {
      abortController.abort();
    };
  }, [url]);

  return [data.results, { loading: data.loading, loaded: data.loaded, error: data.error }];
};
