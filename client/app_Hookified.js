
import React from "react"
function DeviceList(props) {
  function _getPaginationText() {
    const curPage = props.currentPage
    const totalPages = Math.max(1, Math.ceil(props.devices.length / PAGELENGTH))
    return `${curPage} of ${totalPages}`
  }
  function _paginateDevices() {
    return props.devices.slice(
      (props.currentPage - 1) * PAGELENGTH,
      props.currentPage * PAGELENGTH
    )
  }
  function _renderRow({ key, index, style }) {
    return (
      <DeviceRow
        key={key}
        style={style}
        pickDevice={props.pickDevice}
        deviceName={_paginateDevices()[index]}
      />
    )
  }

  const rowCount = _paginateDevices().length
  const rowHeight = 55
  return (
    <div>
      <List
        width={700}
        height={Math.max(rowCount * rowHeight, 110)}
        rowCount={rowCount}
        rowRenderer={_renderRow}
        rowHeight={rowHeight}
        id="device-list"
        devices={_paginateDevices()}
      />
      <div id="pagination">
        <Button
          size="sm"
          type="button"
          className="arrow-button"
          onClick={() => props.changeCurrentPage(-1, false)}
          disabled={props.currentPage <= 1}
        >
          <img src={BACK_ARROW_IMG} alt="Previous Page" />
        </Button>
        <p className="pagination-text">{_getPaginationText()}</p>
        <Button
          size="sm"
          type="button"
          className="arrow-button"
          onClick={() => props.changeCurrentPage(1, false)}
          disabled={
            Math.ceil(props.devices.length / PAGELENGTH) <= props.currentPage
          }
        >
          <img src={FRONT_ARROW_IMG} alt="Next Page" />
        </Button>
      </div>
    </div>
  )
}
