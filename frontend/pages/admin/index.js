import  { dogFetch } from '~/api/dogFetch';
import  { User } from './components/User.js';

class Page_admin extends React.Component {

  state = {
    users: []
  }

  componentDidMount = () =>
    dogFetch(
      (res) => Array.isArray(res.response) ? this.setState({ users: res.response }) : undefined,
      'GET', '/api/users/'
    )

  filterUsers = (id) => {
    const idFilter = (val) => !(val.id === id);
    this.setState({ users: this.state.users.filter(idFilter) });
  }

  render = () =>
    <ul>
      {this.state.users.map((user) =>
        <User user={user} cb={this.filterUsers}/>
      )}
    </ul>
}

export { Page_admin };
