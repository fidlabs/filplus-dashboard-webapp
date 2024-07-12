import { useEffect, useState } from 'react';

import { useQueryParams } from 'hooks/queryParams';
import { api } from 'utils/api';
import { limitDefaultValue, limitStorageName } from 'constant';

const defaultState = {
  results: {},
  loading: false,
  loaded: false,
};

export const useGlifFetch = (url, method, params) => {
  const [data, setData] = useState(defaultState);

  useEffect(() => {
    setData({
      ...defaultState,
      loading: true,
    });

    const abortController = new AbortController();

    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method,
      params,
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch('https://api.node.glif.io', requestOptions)
      .then((response) => response.text())
      .then((results) => {
        setData({
          ...defaultState,
          results: JSON.parse(results),
          loaded: true,
        });
      })
      .catch((e) => {
        console.error(e);
        setData({
          ...defaultState,
          loaded: true,
        });
      });

    return function cancel() {
      abortController.abort();
    };
  }, [url]);

  return [data.results, { loading: data.loading, loaded: data.loaded }];
};
