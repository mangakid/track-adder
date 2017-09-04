import React from 'react';

const TrackRow = ({ className, track, handleClick, value}) => {

  return (
    <div className={className}>
      <div className='track'>
        <div className='titles'>Track:</div>
        <div className='titles'>Artist:</div>
      </div>
      <div className='track'>
        <div className='trackTitle'>{track.name}</div>
        <div className='artist'>{track.artists[0].name}</div>
      </div>
      <button className={className} onClick={handleClick.bind(null, track)}>{value}</button>
    </div>
  );
}

export default TrackRow;
