import '../css/box.css';
import ReportTab from './reporttab';
import React, { Component } from 'react';
import { getFromStorage } from '../utils/storage';

const _ = require('lodash');
const axios = require('axios');

export default class Box extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reports: [],
      userIdMap: null,
    };
  }

  async componentDidMount() {
    const params = {
      token: getFromStorage('login_token'),
    };
    const { data } = await axios.get('/api/reports/info', { params });

    const userIdMap = new Map();
    const uniqueUserId = _.uniq(data.reports.map(report => report.userId));

    const { data: mapData } = await axios.get('/api/users/multiple_info', { params: { array: uniqueUserId } } );
    uniqueUserId.forEach((value, index) => userIdMap.set(value, mapData.data[index]));

    this.setState({
      userIdMap,
      reports: data.reports,
    });
  }

  onClick(id) {
    this.props.history.push(`/reports/${id}`);
  }

  render() {
    return (
      <div id={this.props.id}>
      {this.state.reports.map(report =>
        <ReportTab
          report={report}
          key={report._id}
          onClick={this.onClick.bind(this, report._id)}
          userIdMap={this.state.userIdMap}
        />
      )}
      </div>
    );
  }
}
