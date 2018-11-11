import React from 'react';
import Album from '../album/album';

const AlbumTable = (props) => {
  const { active, fullAlbums, handleAddTrack, option, selectTracks} = props;
  const renderRows = () => fullAlbums.map((album) => {
    const style = fullAlbums.indexOf(album) % 2 ? 'even' : 'odd';
    return <Album album={album} key={fullAlbums.indexOf(album)} className={style} addTrack={handleAddTrack} selectTracks={selectTracks}/>;
  })

  return (fullAlbums.length && option === 'albums' && active === 'results') && 
    <div className='albumsTable'>
      <div className='tableTitle'>Albums Found:</div>
      <div className='rows'>{renderRows()}</div>
    </div> || null;
}

export default AlbumTable;
