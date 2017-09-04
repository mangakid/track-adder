import React from 'react';

const Logout = ({ userId, handleClick }) => {
  if(userId){
    return (
      <div className='logout'>
        {userId + ' '} logged in.
        <button className='custom-button' onClick={handleClick}>Log out?</button>
      </div>
    )
  }
  
  return null;
}

export default Logout;
