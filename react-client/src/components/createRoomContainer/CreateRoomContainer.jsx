import React from 'react';
import axios from 'axios';
import SearchUsersPanel from './SearchInvite/SearchUsersPanel.jsx';
import InviteUsers from './SearchInvite/InviteUsers.jsx';
import CreateRoom from './CreateRoom.jsx';

class CreateRoomContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      combatants: Array(0)
    };
  }

  componentWillReceiveProps(newProps) {
    if (newProps.loggedInUser &&
      !this.state.combatants.includes(newProps.loggedInUser)) {
      this.addCombatant(newProps.loggedInUser);
    } else if (newProps.loggedInUser === '') {
      this.setState({
        combatants: Array(0)
      });
    }
  }

  addCombatant(email) {
    this.setState({
      combatants: [...this.state.combatants, email]
    });
  }

  render() {
    return (
      <div id="site-body" className="tile is-ancestor" >
        <div className="tile is-parent is-vertical">
          <SearchUsersPanel
            searchUsers={this.props.searchUsers}
            foundUsers={this.props.searchedUsers}
            addCombatant={this.addCombatant.bind(this)} />
        </div>
        <div className="tile is-parent is-vertical is-8">
          <article className="tile is-child notification create-room-container">
            <div>
              <CreateRoom
                combatants={this.state.combatants} />
            </div>
          </article>
        </div>
      </div >
    )
  }
}

export default CreateRoomContainer;