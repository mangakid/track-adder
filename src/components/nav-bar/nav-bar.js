import React from 'react';

const NavBar = ({ show, active, handleClick, playlistTracks }) => {
    if(show){
      return(
        <div className='navBar'>
          <div className={active == 'results' ? 'activeTab': 'tab'} type='button' value='results' onClick={handleClick.bind(null, 'results')}>Search results</div>
          <div className={active == 'playlist' ? 'activeTab': 'tab'}type='button' value='playlist' onClick={handleClick.bind(null, 'playlist')}>Your Playlist ({playlistTracks.length})</div>
        </div>
      );
    }

    return null;
}

export default NavBar;
