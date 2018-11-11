import React from 'react';

const Logout = ({ userId, handleClick }) => userId && 
  <div className='logout'>
    {`${userId} logged in.`}
    <button className='custom-button' onClick={handleClick}>Log out?</button>
  </div>
  || null;

export default Logout;
