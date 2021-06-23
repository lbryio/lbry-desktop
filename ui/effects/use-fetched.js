// @flow
import React from 'react';
import usePrevious from 'effects/use-previous';

// Returns true once a loading value has changed from false => true => false
export default function useFetched(fetching: boolean) {
  const wasFetching = usePrevious(fetching);
  const [fetched, setFetched] = React.useState(false);

  React.useEffect(() => {
    if (wasFetching && !fetching) {
      setFetched(true);
    }
  }, [wasFetching, fetching, setFetched]);

  return fetched;
}
