import React from 'react';

const Artist = ({ className, artist, getTop, getAlbums }) => (
  <div className={className}>
    <div className='artist'>{artist.name}</div>
    <div className='buttons'>
      <button className='custom-button' onClick={() => getTop(artist)}>Top 10 Tracks</button>
      <button className='custom-button' onClick={() => getAlbums(artist)}>Get albums</button>
    </div>
  </div>
);

export default Artist;
