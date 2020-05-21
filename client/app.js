class FriendStatus extends React.Component {
  constructor(props) {
    super(props)
    this.handleStatusChange = this.handleStatusChange.bind(this)
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(this.props.friend.id)
  }

  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(this.props.friend.id)
  }
  handleStatusChange() {
    this.setState({
      isOnline: status.isOnline,
    })
  }

  render() {
    return (
      <div>
        <div>this.state.isOnline ? 'Online' : 'Offline';</div>;
      </div>
    )
  }
}
