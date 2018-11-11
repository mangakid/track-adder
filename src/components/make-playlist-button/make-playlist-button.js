import React from 'react';

const MakePlaylistButton = ({ show, handleClick, selectedPlaylist }) => show && <button className='playlistButton' onClick={handleClick}>{selectedPlaylist ? 'Add to: ' + selectedPlaylist.name : 'Make Playlist'}</button> || null;


export default MakePlaylistButton;
