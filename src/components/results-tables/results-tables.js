import React from "react";

import NavBar from "../nav-bar/nav-bar";
import TracksTable from "../tracks-table/tracks-table";
import ArtistsTable from "../artists-table/artists-table";
import AlbumTable from "../album-table/album-table";
import PlaylistTable from "../playlist-table/playlist-table";
import PlaylistsTable from "../playlists-table/playlists-table";

const ResultsTables = ({
  addTrack,
  albums,
  albumsLoading,
  artists,
  artistsLoading,
  changeView,
  fullAlbums,
  getArtistsAlbums,
  getTop,
  nav,
  playlists,
  playlistName,
  playlistTracks,
  radio,
  selectedPlaylist,
  selectPlaylist,
  selectTracks,
  subtractTrack,
  tracks,
  tracksLoading
}) => {
  return (
    <div className="resultsTables">
      <NavBar
        show={tracks.length || albums.length || artists.length}
        active={nav}
        handleClick={changeView}
        playlistTracks={playlistTracks}
      />
      <TracksTable
        active={nav}
        tracks={tracks}
        handleClick={addTrack}
        option={radio}
        tracksLoading={tracksLoading}
      />
      <ArtistsTable
        active={nav}
        artists={artists}
        option={radio}
        getArtistsAlbums={getArtistsAlbums}
        getTop={getTop}
        artistsLoading={artistsLoading}
      />

      <AlbumTable
        active={nav}
        fullAlbums={fullAlbums}
        option={radio}
        handleAddTrack={addTrack}
        selectTracks={selectTracks}
        albumsLoading={albumsLoading}
      />
      <PlaylistTable
        active={nav}
        playlists={playlists}
        tracks={playlistTracks}
        handleClick={subtractTrack}
      />
      <PlaylistsTable
        active={nav}
        playlists={playlists}
        playlistTracks={playlistTracks}
        playlistName={playlistName}
        handleClick={selectPlaylist}
        selectedPlaylist={selectedPlaylist}
      />
    </div>
  );
};

export default ResultsTables;
