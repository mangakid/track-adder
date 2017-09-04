import React from 'react';
import PlaylistRow from '../playlist-row/playlist-row';

class PlaylistsTable extends React.Component{
  render() {
    var rows = [];
    var self = this;

    if(this.props.playlists.length > 0 && this.props.playlistTracks.length > 0 && !this.props.playlistName && !this.props.selectedPlaylist && this.props.active == 'playlist'){
      this.props.playlists.forEach(function(playlist){
        var style = self.props.playlists.indexOf(playlist)%2 ? 'even' : 'odd';
        rows.push(<PlaylistRow playlist={playlist} key={self.props.playlists.indexOf(playlist)} className={style} handleClick={self.props.handleClick}/>);
      })

      return (
        <div className='playlistsTable'>
          <div className='tableTitle'>Select a playlist</div>
          <div className='rows'>{rows}</div>
        </div>
      );
    }

    return null;
  }
};

export default PlaylistsTable;
