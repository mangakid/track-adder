import React, { useContext } from "react";
import Album from "../album/album";

import { AppContext } from "../../app.js";

const AlbumTable = ({ addTrack: handleAddTrack, selectTracks }) => {
  const { nav: active, fullAlbums, radio: option, albumsLoading } = useContext(
    AppContext
  );
  const renderRows = () =>
    fullAlbums.map(album => {
      const style = fullAlbums.indexOf(album) % 2 ? "even" : "odd";
      return (
        <Album
          album={album}
          key={fullAlbums.indexOf(album)}
          className={style}
          addTrack={handleAddTrack}
          selectTracks={selectTracks}
        />
      );
    });

  const renderLoading = () => "Albums loading...";

  return (
    (albumsLoading && renderLoading()) ||
    (fullAlbums.length && option === "albums" && active === "results" && (
      <div className="albumsTable">
        <div className="tableTitle">Albums Found:</div>
        <div className="rows">{renderRows()}</div>
      </div>
    )) ||
    null
  );
};

export default AlbumTable;
