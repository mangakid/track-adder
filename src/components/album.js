import React from 'react';

const Album = React.createClass({

  handleAddAllTracks: function(tracks){
    var self = this;

    tracks.forEach(function(track){
      self.props.addTrack(track);
    });
  },

  render: function(){
    return(
      <div className={this.props.className}>
        <div className='track'>
          <div className='titles'>Album:</div>
          <div className='titles'>Artist:</div>
        </div>
        <div className='track'>
          <div className='trackTitle'>{this.props.album.name}</div>
          <div className='artist'>{this.props.album.artists[0].name}</div>
        </div>
        <div className='buttons'>
          <button className='custom-button' onClick={this.handleAddAllTracks.bind(null, this.props.album.tracks.items)}>Add All Tracks</button>
          <button className='custom-button' onClick={this.props.selectTracks.bind(null, this.props.album.tracks.items)}>Choose Tracks</button>
        </div>
      </div>
    );
  }
});

export default Album;
