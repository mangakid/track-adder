import React from 'react';
import NavBar from './nav-bar';
import TracksTable from './tracks-table';
import ArtistsTable from './artists-table';
import AlbumTable from './album-table';
import PlaylistTable from './playlist-table';
import PlaylistsTable from './playlists-table';

const ResultsTables = (props) => {

  return(
    <div className='resultsTables'>
      <NavBar show={props.tracks.length > 0 || props.albums.length > 0 || props.artists.length > 0} active={props.nav} handleClick={props.changeView} playlistTracks={props.playlistTracks}/>
      <TracksTable active={props.nav} tracks={props.tracks} handleClick={props.addTrack} option={props.radio}/>
      <ArtistsTable active={props.nav} artists={props.artists} option={props.radio} getArtistsAlbums={props.getArtistsAlbums} getTop={props.getTop}/>

      <AlbumTable active={props.nav} fullAlbums={props.fullAlbums} option={props.radio} handleAddTrack={props.addTrack} selectTracks={props.selectTracks}/>
      <PlaylistTable active={props.nav} playlists={props.playlists} tracks={props.playlistTracks} handleClick={props.subtractTrack}/>
      <PlaylistsTable active={props.nav} playlists={props.playlists} playlistTracks={props.playlistTracks} playlistName={props.playlistName} handleClick={props.selectPlaylist} selectedPlaylist={props.selectedPlaylist}/>
    </div>
  );
}

export default ResultsTables;
