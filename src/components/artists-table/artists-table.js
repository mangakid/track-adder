import React from 'react';
import Artist from '../artist/artist';

class ArtistsTable extends React.Component{

  render() {
    var rows = [];
    var self = this;

    if(this.props.artists.length > 0 && this.props.option === 'artists' && this.props.active == 'results'){

      this.props.artists.forEach(function(artist){
          var style = self.props.artists.indexOf(artist)%2 ? 'even' : 'odd';
          rows.push(<Artist artist={artist} key={self.props.artists.indexOf(artist)} className={style} getAlbums={self.props.getArtistsAlbums} getTop={self.props.getTop}/>);
        })

      return(
        <div className='artistsTable'>
          <div className='tableTitle'>Artists Found:</div>
          <div className='rows'>{rows}</div>
        </div>
      );
    } else {
      return null;
    }
  }
};

export default ArtistsTable;
