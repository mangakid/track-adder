import React from 'react';

class SearchBar extends React.Component{

  handleChange = () => {
    this.props.onUserInput(this.refs.searchTextInput.value);
  }

  handleKeyUp = () => {
    this.props.onKeyUp(this.refs.searchTextInput.value);
  }

  clearText = () => {
    if(this.refs.searchTextInput.value != ''){
      this.refs.searchTextInput.value = '';
    }
  }

  render() {
    return (
      <form className='searchForm'>
        <input
           type="text"
           className='inputBar'
           placeholder="Search for..."
           value={this.props.searchText}
           ref="searchTextInput"
           onKeyUp={this.handleKeyUp}
           onChange={this.handleChange} />
        <button type='button' className='addDelete' onClick={this.clearText}>Clear</button>
      </form>
    );
  }
};

export default SearchBar;