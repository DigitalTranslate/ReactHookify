class DeviceList extends React.Component {
  PAGELENGTH = 6
  constructor(props) {
    super(props)
    this._renderRow = this._renderRow.bind(this)
    this._paginateDevices = this._paginateDevices.bind(this)
  }
  render() {
    const rowCount = this._paginateDevices().length
    const rowHeight = 55
    return (
      <div>
        <List
          width={700}
          height={Math.max(rowCount * rowHeight, 110)}
          rowCount={rowCount}
          rowRenderer={this._renderRow}
          rowHeight={rowHeight}
          id="device-list"
          devices={this._paginateDevices()}
        />
        <div id="pagination">
          <Button
            size="sm"
            type="button"
            className="arrow-button"
            onClick={() => this.props.changeCurrentPage(-1, false)}
            disabled={this.props.currentPage <= 1}
          >
            <img src={BACK_ARROW_IMG} alt="Previous Page" />
          </Button>
          <p className="pagination-text">{this._getPaginationText()}</p>
          <Button
            size="sm"
            type="button"
            className="arrow-button"
            onClick={() => this.props.changeCurrentPage(1, false)}
            disabled={
              Math.ceil(this.props.devices.length / this.PAGELENGTH) <=
              this.props.currentPage
            }
          >
            <img src={FRONT_ARROW_IMG} alt="Next Page" />
          </Button>
        </div>
      </div>
    )
  }
  _getPaginationText = () => {
    const curPage = this.props.currentPage
    const totalPages = Math.max(
      1,
      Math.ceil(this.props.devices.length / this.PAGELENGTH)
    )
    return `${curPage} of ${totalPages}`
  }
  /**
   * Gets the devices to be shown for the current page the user is on
   */
  _paginateDevices() {
    return this.props.devices.slice(
      (this.props.currentPage - 1) * this.PAGELENGTH,
      this.props.currentPage * this.PAGELENGTH
    )
  }
  _renderRow({ key, index, style }) {
    return (
      <DeviceRow
        key={key}
        style={style}
        pickDevice={this.props.pickDevice}
        deviceName={this._paginateDevices()[index]}
      />
    )
  }
}
