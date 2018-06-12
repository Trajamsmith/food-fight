import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { BrowserRouter, Route, Link } from 'react-router-dom';
import axios from 'axios';

import Navbar from './components/Navbar.jsx';
import MainView from './components/MainView.jsx'
import SignupPage from './components/AuthUserMenu/SignupPage.jsx';
import Room from './components/Room.jsx';

import 'bulma/css/bulma.css';
import 'animate.css/animate.css';
import './styles/main.scss';

// ─── REDUX STUFF ────────────────────────────────────────────────────────────────
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider, connect } from 'react-redux';
import logger from 'redux-logger';
import { login, logout, searchUsers } from '../../redux/actions';

import reducer from '../../redux/reducer';

const store = createStore(reducer, applyMiddleware(logger));

const mapStateToProps = state => {
  return {
    loggedInUsername: state.username,
    searchedUsers: state.searchedUsers,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: (username) => dispatch(login(username)),
    logout: () => dispatch(logout()),
    searchUsers: (users) => dispatch(searchUsers(users)),
  };
};
//────────────────────────────────────────────────────────────────────────────────

class ConnectedApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      restaurants: [],

      loginError: false,
    };
  }

  componentDidMount() {
    axios.get('/checklogin')
      .then(res => {
        if (res.data.user) {
          console.log('Logged in as:', res.data.user.email);
          this.props.login(res.data.user.email);
          this.setState({
            loginError: false,
          });
        }
      });
  }

  searchYelp() {
    $.post('/api/search', { zip: this.state.query }, (data, status) => {
      console.log(`Requested Yelp search for ${this.state.query}:`, status);
      if (data.businesses) {
        this.setState({
          restaurants: data.businesses,
        });
      }
    });
  }

  updateQuery(e) {
    this.setState({
      query: e.target.value,
    });
  }

  searchUsers(query) {
    console.log('SEARCHING FOR', query);
    axios.post('/searchUsers', { query })
      .then(res => {
        console.log('RESULTS', res);
        this.props.searchUsers(res.data);
      });
  }

  //
  // ─── USER AUTH ──────────────────────────────────────────────────────────────────
  //
  subscribe(email, password, zip) {
    console.log(`Subscribe with ${email} and ${password}`);
    axios.post('/subscribe', {
      email,
      password,
      zip
    })
      .then((res) => {
        const email = JSON.parse(res.config.data).email;
        if (res) {
          this.props.login(email);
        }
      })
      .catch(() => {
        this.setState({
          subscribeError: true
        });
      });
  }

  login(email, password) {
    console.log(`Login with ${email} and ${password}`);
    axios.post('/login', {
      email,
      password
    })
      .then(res => {
        if (res.config.data) {
          console.log('Logged in as:', JSON.parse(res.config.data).email);
          this.props.login(JSON.parse(res.config.data).email);
        }
      })
      .catch(
        (error => {
          console.log(this);
          this.setState({
            loginError: true
          });
        })()
      );
  }

  logout() {
    axios.get('/logout')
      .then(res => {
        console.log('Logging out');
        this.props.logout();
        this.setState({
          loginError: false
        });
      })
  }
  // ────────────────────────────────────────────────────────────────────────────────


  render() {
    console.log('STORE', store.getState());
    console.log('INDEX PROPS', this.props);
    let room = this.state.loggedInUsername
      ? <Route path="/rooms/:roomID" render={(props) => <Room username={this.state.loggedInUsername} {...props} />} />
      : <Route path="/rooms/:roomID" component={Room} />
    return (
      <BrowserRouter>
        <div>
          <div>
            <Navbar
              login={this.login.bind(this)}
              logout={this.logout.bind(this)}
              subscribe={this.subscribe.bind(this)}
              username={this.state.loggedInUsername}
              error={this.state.loginError}
              subscribeError={this.state.subscribeError} />
          </div >
          <Route exact path="/" render={
            (props) => <MainView
              searchUsers={this.searchUsers.bind(this)}
              searchedUsers={this.props.searchedUsers}
              loggedInUser={this.state.loggedInUsername}
              {...props} />} />
          <Route path="/signup" render={
            (props) => <SignupPage
              subscribe={this.subscribe.bind(this)}
              {...props} />} />
          {room}
        </div>
      </BrowserRouter>
    );
  }
}

const App = connect(mapStateToProps, mapDispatchToProps)(ConnectedApp);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('app'));
