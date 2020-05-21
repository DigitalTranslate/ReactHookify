class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  async componentDidMount() {
    await ChatAPI.subscribeToFriendStatus(this.props.friend.id);
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(this.props.friend.id);
  }
  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline,
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return 'Loading...';
    }
    return (
      <div>
        <div>this.state.isOnline ? 'Online' : 'Offline';</div>;
      </div>
    );
  }
}
