import React from 'react';
import TrackRow from './track-row';

const PlaylistTable = React.createClass({
  render: function(){
    var rows = [];

    var self = this;

    if(this.props.tracks.length > 0 && this.props.active == 'playlist' && !this.props.playlists.length > 0){
      this.props.tracks.forEach(function(track){
        var style = self.props.tracks.indexOf(track)%2 ? 'even' : 'odd';
        rows.push(<TrackRow track={track} key={self.props.tracks.indexOf(track)} className={style} value='-' handleClick={self.props.handleClick}/>);
      });

      return (
        <div className='playlistTable'>
          <div className='rows'>{rows}</div>
        </div>
      );
    } else {
      return null;
    }
  }
});

export default PlaylistTable;
