import React from 'react';

const Artist = ({ className, artist, getTop, getAlbums }) => {

  return(
    <div className={className}>
      <div className='artist'>{artist.name}</div>
      <div className='buttons'>
        <button className='custom-button' onClick={getTop.bind(null, artist)}>Top 10 Tracks</button>
        <button className='custom-button' onClick={getAlbums.bind(null, artist)}>Get albums</button>
      </div>
    </div>
  );
}

export default Artist;
