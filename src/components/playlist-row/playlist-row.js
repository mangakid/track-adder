import React from 'react';

const PlaylistRow = ({ className, playlist, handleClick }) => {

    return (
      <div className={className}>
        <div>{playlist.name}</div>
        <button className='custom-button' onClick={handleClick.bind(null, playlist)}>Select Playlist</button>
      </div>
    );
}

export default PlaylistRow;
