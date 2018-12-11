import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Home extends Component {
  componentWillMount() {
      const { isAuthenticated, getProfile } = this.props.auth;
      if (isAuthenticated() ) {
          getProfile();
      }
  }
  login() {
    this.props.auth.login();
  }
  render() {
    const { isAuthenticated } = this.props.auth;
    return (
        <div className="container">
          <div className="jumbotron">
            <h1>Welcome!</h1>
              {
                  !isAuthenticated() && (
                      <div>
                        <p>Please sign in/sign up in order to access chat.</p>
                        <p><a className="btn btn-primary btn-lg" onClick={this.login.bind(this)}>Login</a></p>
                      </div>
                  )
              }
              {
                  isAuthenticated() && (
                      <div>
                        <p>Start a conversation!</p>
                        <Link className="btn btn-primary btn-lg" to="chat">Chat</Link>
                      </div>
                  )
              }
          </div>
            {this.props.children}
        </div>
    );
  }
}

export default Home;