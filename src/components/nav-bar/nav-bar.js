import React, { useContext } from "react";

import { AppContext } from "../../app.js";

const NavBar = ({ handleClick }) => {
  const { nav: active, playlistTracks, tracks, albums, artists } = useContext(
    AppContext
  );
  const show = !!(tracks.length || albums.length || artists.length);
  const resultsActive = active === "results";
  return (
    (show && (
      <div className="navBar">
        <div
          className={(resultsActive && "activeTab") || "tab"}
          type="button"
          value="results"
          onClick={() => handleClick("results")}
        >
          Search results
        </div>
        <div
          className={(!resultsActive && "activeTab") || "tab"}
          type="button"
          value="playlist"
          onClick={() => handleClick("playlist")}
        >
          Your Playlist ({playlistTracks.length})
        </div>
      </div>
    )) ||
    null
  );
};

export default NavBar;
