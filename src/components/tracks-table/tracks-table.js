import React, { useContext } from "react";
import TrackRow from "../track-row/track-row";

import { AppContext } from "../../app.js";

const TracksTable = ({ addTrack: handleClick }) => {
  const { nav: active, tracks, radio: option, tracksLoading } = useContext(
    AppContext
  );
  const renderRows = () =>
    tracks.map((track, index) => (
      <TrackRow
        track={track}
        key={index}
        className={index % 2 ? "even" : "odd"}
        value="+"
        handleClick={handleClick}
      />
    ));

  const renderLoading = () => "Tracks loading...";

  return (
    (tracksLoading && renderLoading()) ||
    (tracks.length && option === "tracks" && active === "results" && (
      <div className="tracksTable">
        <div className="tableTitle">Tracks Found:</div>
        <div className="rows">{renderRows()}</div>
      </div>
    )) ||
    null
  );
};

export default TracksTable;
