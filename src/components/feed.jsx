import '../css/feed.css';
import { MdEdit } from 'react-icons/md';
import React, { Component } from 'react';
import Divider from '@material-ui/core/Divider';

const axios = require('axios');

export default class Feed extends Component {
  constructor(props) {
    super(props);
    this.itemPerPage = 3;
  }

  async loadDataByFromAndTo(from, to) {
    const params = {
      to,
      from,
    };
    const { data } = await axios.get('/api/news/from_to_info', { params });
    this.props.updateFeed(data);
  }

  async loadDataByIdAndTo(id, to) {
    const params = { id, to };
    const { data } = await axios.get('/api/news/next_info', { params });
    this.props.updateFeed(data);
  }

  async componentDidMount() {
    if (!this.props.data.length) {
      await this.loadDataByFromAndTo(0, this.itemPerPage);
    }
  }

  async loadMoreButton() {
    const len = this.props.data.length;
    await this.loadDataByIdAndTo(this.props.data[len-1]._id, this.itemPerPage);
  }

  editPost(id) {
    this.props.history.push(`/edit/news/${id}`);
  }

  render() {
    const type = this.props.user.type;
    return (
      <div id={this.props.id}>
        {this.props.data.map((news, index) =>
          <div key={`${news._id}`} className="feed-group">
            <div className="feed-title">
              <h1>{news.title}</h1>
              {(type === 'staff' || type === 'admin') &&
                <button onClick={this.editPost.bind(this, news._id)}><MdEdit/></button>
              }
            </div>
            <div className="feed-time">{news.startDate.slice(0, 10)}</div>
            <div className="feed-content" id={`feed-content-${index}`}>
              {news.content.split('\n').map((value, pIndex) =>
                <p key={`${news._id}-p-${pIndex}`}>
                  {value}
                </p>
              )}
            </div>
            <br/>
            <Divider/>
          </div>
        )}

        {this.props.data.length !== this.props.n &&
          <div className="continue-button" onClick={this.loadMoreButton.bind(this)}>Load more</div>
        }
      </div>
    );
  }
}
