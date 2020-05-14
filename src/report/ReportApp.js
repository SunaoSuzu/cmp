import React from "react";

//

export default class ReportApp extends React.Component {
  render() {
    return <h1>ReportApp(reportId = {this.props.match.params.reportId})</h1>;
  }
}
