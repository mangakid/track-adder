import React from 'react';
import TrackRow from '../track-row/track-row';

const PlaylistTable = ({ active, handleClick, playlists, tracks, }) => {
  const renderRows = () => tracks.map((track, index) => (<TrackRow track={track} key={index} className={index % 2 ? 'even' : 'odd'} value='-' handleClick={handleClick}/>));

  return (tracks.length && active === 'playlist' && !playlists.length) &&
    <div className='playlistTable'>
      <div className='rows'>{renderRows()}</div>
    </div> || null;
}

export default PlaylistTable;
