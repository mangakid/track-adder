import React from 'react';
import Album from '../album/album';

class AlbumTable extends React.Component{

  render(){
    var rows = [];
    var self = this;

    if(this.props.fullAlbums.length > 0 && this.props.option === 'albums' && this.props.active == 'results'){

      this.props.fullAlbums.forEach(function(album){
          var style = self.props.fullAlbums.indexOf(album)%2 ? 'even' : 'odd';
          rows.push(<Album album={album} key={self.props.fullAlbums.indexOf(album)} className={style} addTrack={self.props.handleAddTrack} selectTracks={self.props.selectTracks}/>);
        })

      return(
        <div className='albumsTable'>
          <div className='tableTitle'>Albums Found:</div>
          <div className='rows'>{rows}</div>
        </div>
      );
    }

    return (<div></div>);
  }
};

export default AlbumTable;
