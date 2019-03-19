import React, { useContext } from "react";
import Artist from "../artist/artist";

import { AppContext } from "../../app.js";

const ArtistsTable = ({ getArtistsAlbums, getTop }) => {
  const { nav: active, artists, radio: option, artistsLoading } = useContext(
    AppContext
  );
  const renderRows = () =>
    artists.map((artist, index) => (
      <Artist
        artist={artist}
        key={index}
        className={index % 2 ? "even" : "odd"}
        getAlbums={getArtistsAlbums}
        getTop={getTop}
      />
    ));

  return (
    (artistsLoading && "Atrists loading...") ||
    (artists.length && option === "artists" && active === "results" && (
      <div className="artistsTable">
        <div className="tableTitle">Artists Found:</div>
        <div className="rows">{renderRows()}</div>
      </div>
    )) ||
    null
  );
};

export default ArtistsTable;
