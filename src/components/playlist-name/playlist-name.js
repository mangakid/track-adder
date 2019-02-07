import React, { useRef } from "react";

const PlaylistName = ({ handleClick, onUserInput, playlistName, show }) => {
  const inputEl = useRef(null);

  const handleChange = () => {
    onUserInput(inputEl.current.value);
  };

  return (
    (show && (
      <form className="playlistName">
        <input
          type="text"
          className="inputBar"
          placeholder="Playlist Name..."
          value={playlistName}
          ref={inputEl}
          onChange={handleChange}
        />
        <button className="addDelete" type="button" onClick={handleClick}>
          Add to existing?
        </button>
      </form>
    )) ||
    null
  );
};

export default PlaylistName;
