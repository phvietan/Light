import '../css/navigationbar.css';
import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import DropdownMenu from './dropdownmenu';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

function isContainUndefined(array) {
  return array.findIndex(value => !value) !== -1;
}

export default class NavigationBar extends Component {
  isLoading() {
    const keys = ['user', 'history'];
    const value = keys.map(key => this.props[key]);
    return isContainUndefined(value);
  }

  redirect(url) {
    this.props.history.push(url);
  }

  render() {
    if (this.isLoading()) {
      return (
        <div>
          <AppBar position="static" className="navigation-bar">
            <Grid item>
              <Toolbar
                className="web-icon navigation-item navigation-bar-icon"
                onClick={this.redirect.bind(this, '/home')}
              >
                <img src='/icon.svg' alt="icon"></img>
              </Toolbar>
            </Grid>
          </AppBar>
        </div>
      );
    }
    const { userId: id } = this.props.user;
    const W = window.innerWidth;
    const style = {
      marginRight: '10rem',
    };

    return (
      <div>
        <AppBar position="static" className="navigation-bar">
          <Grid
            container
            spacing={24}
            justify="space-between"
          >
            <Grid item>
              <Toolbar
                className="web-icon navigation-item navigation-bar-icon"
                onClick={this.redirect.bind(this, '/home')}
              >
                <img src='/icon.svg' alt="icon"></img>
              </Toolbar>
            </Grid>

            <Grid item>
              <Toolbar className="navigation-bar-item">
                <div className="nav-button" style={W < 600 ? {} : style}>
                  <DropdownMenu
                    id={id}
                    history={this.props.history}
                    color='#FA5A5B'
                  />
                </div>
              </Toolbar>
            </Grid>
          </Grid>
        </AppBar>
      </div>
    );
  }
}
