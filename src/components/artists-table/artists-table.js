import React from 'react';
import Artist from '../artist/artist';

const ArtistsTable = ({ active, artists, getArtistsAlbums, getTop, option}) => {
  const renderRows = () => artists.map((artist, index) => (
    <Artist 
      artist={artist} 
      key={index} 
      className={index % 2 ? 'even' : 'odd'} 
      getAlbums={getArtistsAlbums} 
      getTop={getTop} />
  ));

  return(artists.length && option === 'artists' && active === 'results') &&
    <div className='artistsTable'>
      <div className='tableTitle'>Artists Found:</div>
      <div className='rows'>{renderRows()}</div>
    </div>
    || null;
};

export default ArtistsTable;
