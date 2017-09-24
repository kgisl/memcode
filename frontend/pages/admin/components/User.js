import  { dogFetch } from '~/api/dogFetch';

class User extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      id: PropTypes.number,
      username: PropTypes.string
    }),
    cb: PropTypes.func
  }

  state = { status: null }

  deleteUser = () =>
    dogFetch((request) => this.setState({ status: request.status }),
    'DELETE', `/api/users/${this.props.user.id}`
  ).then(() => {
    this.setState({ status: null });
    this.props.cb(this.props.user.id);
  })

  render = () =>
    <li key={this.props.user.id}>
      { this.props.user.username }
      { this.state.status ?
        <i className="fa fa-clock-o"/>
       :
        <button onClick={() => this.deleteUser()}>Remove</button>
    }
    </li>
}

export { User };
