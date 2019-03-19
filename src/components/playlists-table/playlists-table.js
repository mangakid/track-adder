import React, { useContext } from "react";
import PlaylistRow from "../playlist-row/playlist-row";

import { AppContext } from "../../app.js";

const PlaylistsTable = ({ selectPlaylist: handleClick }) => {
  const {
    nav: active,
    playlists,
    playlistTracks,
    playlistName,
    selectedPlaylist
  } = useContext(AppContext);
  const renderRows = () =>
    playlists.map((playlist, index) => (
      <PlaylistRow
        playlist={playlist}
        key={index}
        className={index % 2 ? "even" : "odd"}
        handleClick={handleClick}
      />
    ));

  return (
    (playlists.length &&
      playlistTracks.length &&
      !playlistName &&
      !selectedPlaylist &&
      active === "playlist" && (
        <div className="playlistsTable">
          <div className="tableTitle">Select a playlist</div>
          <div className="rows">{renderRows()}</div>
        </div>
      )) ||
    null
  );
};

export default PlaylistsTable;
