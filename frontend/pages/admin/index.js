import  { dogFetch } from '~/api/dogFetch';

class Page_admin extends React.Component {

  state = {
    users: [],
    status: null,
    response: null
  }

  componentDidMount = () =>
    dogFetch(
      (request) => this.setState({ ...request }),
      'GET', '/api/users/'
    ).then(() => {
      this.setState({
        users: this.state.status.toString() === 'Symbol(Success)' ? this.state.response : [],
        status: null
      });
    })

  deleteUser = (id) =>
    dogFetch((request) => this.setState({ ...request }),
    'DELETE', `/api/users/${id}`
  ).then(() => {
    this.setState({ status: null });
    const idFilter = (val) => !(val.id === id);
    this.setState({ users: this.state.users.filter(idFilter) });
  })

  render = () =>
    <ul>
      {this.state.users.map((user) =>
        <li key={user.id}>
          { user.username }
          { this.state.status ?
            <i className="fa fa-clock-o"/>
          :
            <button onClick={() => this.deleteUser(user.id)}>Remove</button>
          }
        </li>
      )}
    </ul>
}

export { Page_admin };
