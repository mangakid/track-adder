import React from 'react';

const PlaylistName = React.createClass({

  handleChange: function(){
    this.props.onUserInput(this.refs.playlistTextInput.value);
  },

  render: function(){
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
    } else {
      return null;
    }
  }
});

export default PlaylistName;
