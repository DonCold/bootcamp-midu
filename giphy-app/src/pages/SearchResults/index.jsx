import React, { useEffect, useRef, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import debounce from 'just-debounce-it';

import ListGif from '@/components/ListGif';

import { useGifs } from '@/hooks/useGifs';

import { capitalize } from '@/libs/util';
import useNearScreen from '@/hooks/useNearScreen';

const SearchResults = ({ params }) => {
  const { query } = params;
  const { loading, loadingNextPage, gifs, setPage } = useGifs({ query, limit: 20 });

  const externalRef = useRef();
  const { isNearScreen } = useNearScreen({
    externalRef: loading ? null : externalRef,
    once: false
  });

  const handleNextPage = () => {
    setPage(page => page + 1);
  }
  const debounceHandleNextPage = useCallback(debounce(handleNextPage, 1000), []);

  useEffect(() => {
    if ( isNearScreen ) debounceHandleNextPage();
  } , [isNearScreen]);

  if (loading) return <p>Loading...</p>;
  if (gifs.length === 0 || !gifs) return <p>No gifs found</p>;

  return (
    <>
      <Helmet>
        <title>{`${capitalize(decodeURI(query))} | Gifs`}</title>
      </Helmet>
      <h2>{ capitalize(decodeURI( query )) }</h2>
      {
        loading
        ? <p>Loading...</p>
        : <div>
          <ListGif gifs={gifs} />
          <div id="visor" ref={ externalRef }></div>
        </div>
      }
      { loadingNextPage && <p>Loading...</p> }
      <br />
    </>
  )
}

export default SearchResults;
