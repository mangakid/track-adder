import React from 'react';
import TrackRow from '../track-row/track-row';

const TracksTable = ({ active, handleClick, option, tracks }) => {
  const renderRows = () => tracks.map((track, index) => (
    <TrackRow 
      track={track} 
      key={index} 
      className={index %2 ? 'even' : 'odd'} 
      value='+' 
      handleClick={handleClick}/>
  ));

  return (tracks.length && option === 'tracks' && active === 'results') && (
    <div className='tracksTable'>
      <div className='tableTitle'>Tracks Found:</div>
      <div className='rows'>{renderRows()}</div>
    </div>
  ) || null;
};

export default TracksTable;
