import React from 'react';

class PlaylistName extends React.Component{

  handleChange = () => {
    this.props.onUserInput(this.refs.playlistTextInput.value);
  }

  render() {
    if(this.props.show != false){
      return(
        <form className='playlistName'>
          <input
             type="text"
             className='inputBar'
             placeholder="Playlist Name..."
             value={this.props.playlistName}
             ref="playlistTextInput"
             onChange={this.handleChange} />
             <button className='addDelete' type='button' onClick={this.props.handleClick}>Add to existing?</button>
        </form>
      );
    }

    return null;
  }
};

export default PlaylistName;
