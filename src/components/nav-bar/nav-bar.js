import React from 'react';

const NavBar = ({ show, active, handleClick, playlistTracks }) => {
  const resultsActive = active === 'results';
  return show && (
    <div className='navBar'>
      <div className={resultsActive && 'activeTab' || 'tab'} type='button' value='results' onClick={() => handleClick('results')}>Search results</div>
      <div className={!resultsActive && 'activeTab' || 'tab'} type='button' value='playlist' onClick={() => handleClick('playlist')}>Your Playlist ({playlistTracks.length})</div>
    </div>
) || null
};

export default NavBar;
