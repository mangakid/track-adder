import React from "react";

import NavBar from "../nav-bar/nav-bar";
import TracksTable from "../tracks-table/tracks-table";
import ArtistsTable from "../artists-table/artists-table";
import AlbumTable from "../album-table/album-table";
import PlaylistTable from "../playlist-table/playlist-table";
import PlaylistsTable from "../playlists-table/playlists-table";

const ResultsTables = ({
  addTrack,
  changeView,
  getArtistsAlbums,
  getTop,
  selectTracks,
  selectPlaylist,
  subtractTrack
}) => {
  return (
    <div className="resultsTables">
      <NavBar handleClick={changeView} />
      <TracksTable addTrack={addTrack} />
      <ArtistsTable getArtistsAlbums={getArtistsAlbums} getTop={getTop} />
      <AlbumTable addTrack={addTrack} selectTracks={selectTracks} />
      <PlaylistTable handleClick={subtractTrack} />
      <PlaylistsTable selectPlaylist={selectPlaylist} />
    </div>
  );
};

export default ResultsTables;
