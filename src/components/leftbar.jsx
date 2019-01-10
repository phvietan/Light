import '../css/leftbar.css';
import React, { Component } from 'react';

const priviledgeLayout = {
  School: [
    { name: 'Feed', priviledge: /.*?/ }, // Match anything
    { name: 'Box', priviledge: /.*?/ }, // Match anything
    { name: 'Manage', priviledge: /staff|admin/ }, // Match staff or admin only
  ]
};

const style = {
  color: 'white',
  backgroundColor: '#FA5A5B',
  borderRadius: '5px',
};

export default class LeftBar extends Component {
  render() {
    const { openingCourses, tab, registeredCourses } = this.props;
    return (
      <div className="left-bar" style={{ width: this.props.width }}>
        <div className="left-bar-list">
          {Object.keys(priviledgeLayout).map((key,outIndex) =>
            <div key={key}>
              <div className="left-bar-item" id={`${key}H1`}>
                <h1>{key}</h1>
              </div>
              {priviledgeLayout[key].filter(value => value.priviledge.test(this.props.userType)).map((value, index) =>
                  <h2
                    style={tab === `${key}${index}` ? style : {}}
                    onClick={() => this.props.chooseTab(`${key}${index}`)}
                    key={`${key}${index}`}
                  >
                    {value.name}
                  </h2>
              )}
            </div>
          )}
          {openingCourses.length !== 0 &&
            <div id="left-bar-opening-courses">
              <div className="left-bar-item">
                <h1>Opening</h1>
              </div>
              {openingCourses.map(value =>
                <h2
                  style={tab === `Opening-${value._id}` ? style : {}}
                  onClick={() => this.props.chooseTab(`Opening-${value._id}`)}
                  key={`Opening-${value._id}`}
                >
                  {value.code}
                </h2>
              )}
            </div>
          }

          {registeredCourses.length !== 0 &&
            <div id="left-bar-registered-courses">
              <div className="left-bar-item">
                <h1>Registered</h1>
              </div>
              {registeredCourses.map(value =>
                <h2
                  style={tab === `Registered-${value.id}` ? style : {}}
                  onClick={() => this.props.chooseTab(`Registered-${value.id}`)}
                  key={`Registered-${value.id}`}
                >
                  {value.code} ({value.semester}, {value.year})
                </h2>
              )}
            </div>
          }

        </div>
      </div>
    );
  }
}
