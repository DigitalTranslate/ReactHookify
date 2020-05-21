class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    this.test(5);
  }
  componentDidUpdate(prevProps) {
    if (this.props.counter !== prevProps.counter) {
      console.log('hi');
    }
  }

  test(num) {
    console.log(num);
  }

  handleStatusChange(status) {
    this.setState({
      isOnline: true,
    });
  }

  render() {
    return <div>Test</div>;
  }
}
