import React from 'react';

const MakePlaylistButton = ({show,handleClick,selectedPlaylist}) => {
  if(show){
    return <button className='playlistButton' onClick={handleClick}>{selectedPlaylist ? 'Add to: ' + selectedPlaylist.name : 'Make Playlist'}</button>
  }else{
    return null;
  }
}

export default MakePlaylistButton;
