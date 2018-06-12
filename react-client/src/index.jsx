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
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import { login } from '../../redux/actions';

import reducer from '../../redux/reducer';

const store = createStore(reducer, applyMiddleware(logger));
store.subscribe(() => console.log('DISPATCH OCCURRING'));
//────────────────────────────────────────────────────────────────────────────────

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      restaurants: [],

      loggedIn: false,
      loggedInUsername: '',
      loginError: false,

      searchedUsers: []
    };
  }

  componentDidMount() {
    axios.get('/checklogin')
      .then(res => {
        if (res.data.user) {
          console.log('Logged in as:', res.data.user.email);
          this.setState({
            loggedIn: true,
            loggedInUsername: res.data.user.email,
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
        this.setState({
          searchedUsers: res.data
        });
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
          this.setState({
            loggedIn: true,
            loggedInUsername: email
          })
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
          this.setState({
            loggedIn: true,
            loggedInUsername: JSON.parse(res.config.data).email
          });
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
        this.setState({
          loggedIn: false,
          loggedInUsername: '',
          loginError: false
        });
      })
  }
  // ────────────────────────────────────────────────────────────────────────────────


  render() {
    console.log('STORE', store.getState());
    let room = this.state.loggedInUsername
      ? <Route path="/rooms/:roomID" render={(props) => <Room username={this.state.loggedInUsername} {...props} />} />
      : <Route path="/rooms/:roomID" component={Room} />
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <div>
              <Navbar
                login={this.login.bind(this)}
                logout={this.logout.bind(this)}
                subscribe={this.subscribe.bind(this)}
                loggedIn={this.state.loggedIn}
                username={this.state.loggedInUsername}
                error={this.state.loginError}
                subscribeError={this.state.subscribeError} />
            </div >
            <Route exact path="/" render={
              (props) => <MainView
                searchUsers={this.searchUsers.bind(this)}
                searchedUsers={this.state.searchedUsers}
                loggedIn={this.state.loggedIn}
                loggedInUser={this.state.loggedInUsername}
                {...props} />} />
            <Route path="/signup" render={
              (props) => <SignupPage
                subscribe={this.subscribe.bind(this)}
                {...props} />} />
            {room}
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
