import React, { useRef } from "react";

const SearchBar = props => {
  const inputEl = useRef(null);

  const handleChange = () => {
    props.onUserInput(inputEl.current.value);
  };

  const handleKeyUp = () => {
    props.onKeyUp(inputEl.current.value);
  };

  const clearText = e => {
    e.preventDefault();
    if (inputEl.current.value) {
      inputEl.current.value = "";
    }
  };

  return (
    <div className="searchForm">
      <input
        type="text"
        className="inputBar"
        placeholder="Search for..."
        value={props.searchText}
        ref={inputEl}
        onKeyUp={handleKeyUp}
        onChange={handleChange}
      />
      <button type="button" className="addDelete" onClick={clearText}>
        Clear
      </button>
    </div>
  );
};

export default SearchBar;
