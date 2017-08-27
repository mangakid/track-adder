import React from 'react';

class Login extends React.Component {

  render(){
    return(
      <div>
        <h3>You need to login to spotify to use trackadder</h3>
        <button className='custom-button' onClick={this.props.login}>
          Login
        </button>
      </div>
    );
  }
}

export default Login;
