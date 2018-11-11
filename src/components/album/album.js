import React from 'react';

const Album = (props) => {
  const { addTrack, album: { artists, name, tracks: { items: tracks } }, className, selectTracks} = props;

  const handleAddAllTracks = () => {
    tracks.forEach((track) => {
      addTrack(track);
    });
  }

  const handleSelectTracks = () => {
    selectTracks(tracks)
  }

  return(
    <div className={className}>
      <div className='track'>
        <div className='titles'>Album:</div>
        <div className='titles'>Artist:</div>
      </div>
      <div className='track'>
        <div className='trackTitle'>{name}</div>
        <div className='artist'>{artists[0].name}</div>
      </div>
      <div className='buttons'>
        <button className='custom-button' onClick={handleAddAllTracks}>Add All Tracks</button>
        <button className='custom-button' onClick={handleSelectTracks}>Choose Tracks</button>
      </div>
    </div>
  );
};

export default Album;
