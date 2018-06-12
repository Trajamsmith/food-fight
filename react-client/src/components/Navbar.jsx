import React from 'react';
import LoginDialog from './AuthUserMenu/LoginDialog.jsx';
import SubscribeDialog from './AuthUserMenu/SubscribeDialog.jsx';
import UserMenu from './AuthUserMenu/UserMenu.jsx';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn,
  }
};

class ConnectedNavbar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let authentication = this.props.loggedIn ? (
      <UserMenu
        logout={this.props.logout} />
    ) : (
        [<div className="control" key="1">
          <LoginDialog
            login={this.props.login}
            error={this.props.error} />
        </div>,
        <div className="control" key="2">
          <SubscribeDialog
            subscribe={this.props.subscribe}
            subscribeError={this.props.subscribeError} />
        </div>]
      );

    return (
      <nav className="navbar is-transparent">
        <div className="navbar-brand">
          <h1 id="logo">FoodFight!</h1>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="field is-grouped">
              <p className="control">
                <a className="bd-tw-button button" data-social-network="Twitter" data-social-action="tweet" data-social-target="http://localhost:4000" target="_blank" href="https://twitter.com/intent/tweet?text=Let's get ready to Food Fight!">
                  <span className="icon">
                    <i className="fab fa-twitter"></i>
                  </span>
                  <span>
                    Tweet
                  </span>
                </a>
              </p>
              {authentication}
            </div>
          </div>
        </div>
      </nav >
    );
  }
}

const Navbar = connect(mapStateToProps)(ConnectedNavbar);

export default Navbar;
