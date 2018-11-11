import React from 'react';

const Login = ({ login }) => (
  <div>
    <h3>You need to login to spotify to use trackadder</h3>
    <button className='custom-button' onClick={login}>
      Login
    </button>
  </div>
);

export default Login;
