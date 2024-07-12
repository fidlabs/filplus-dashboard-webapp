import { useHistory, useLocation } from 'react-router-dom';
import { useMemo } from 'react';

const pushQueryRoute = (history) => (query) => {
  history.push(`${history.location.pathname}?${query.toString()}`);
};

/*
 *  Use this hook if you have troubles with queryParams.js
 */
function useQuery() {
  const history = useHistory();
  const location = useLocation();
  return useMemo(
    () => ({
      query: new URLSearchParams(location.search),
      pushQueryRoute: pushQueryRoute(history),
    }),
    [history, location.search]
  );
}

export default useQuery;
