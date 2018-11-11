import React from 'react';
import PlaylistRow from '../playlist-row/playlist-row';

const PlaylistsTable = ({active, handleClick, playlistName, playlistTracks, playlists, selectedPlaylist}) => {
  const renderRows = () => playlists.map((playlist, index) => (<PlaylistRow playlist={playlist} key={index} className={index % 2 ? 'even' : 'odd'} handleClick={handleClick}/>));

  return (playlists.length && playlistTracks.length && !playlistName && !selectedPlaylist && active === 'playlist') && (
    <div className='playlistsTable'>
      <div className='tableTitle'>Select a playlist</div>
      <div className='rows'>{renderRows()}</div>
    </div>
  ) || null;
};

export default PlaylistsTable;
