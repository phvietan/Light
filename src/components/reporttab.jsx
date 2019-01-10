import '../css/reporttab.css';
import React, { Component } from 'react';
import Divider from '@material-ui/core/Divider';

export default class ReportTab extends Component {
  render() {
    const { title, startDate } = this.props.report;
    const D = new Date(startDate);
    const date = D.toDateString();

    let userId = null;
    if (this.props.userIdMap) {
      userId = this.props.userIdMap.get(this.props.report.userId);
    }
    
    return (
      <div>
        <div className="report-tab" onClick={this.props.onClick}>
          <h1>{title}</h1>
          <h2>{date}</h2>
          <h3>By: {userId}</h3>
        </div>
        <br/>
        <Divider/>
      </div>
    );
  }
};
