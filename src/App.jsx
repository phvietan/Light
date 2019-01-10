import Home from './pages/home';
import Profile from './pages/profile';
import Welcome from './pages/welcome';
import AddNews from './pages/addnews';
import AddUser from './pages/adduser';
import EditNews from './pages/editnews';
import EditUser from './pages/edituser';
import AddReport from './pages/addreport';
import AddCourse from './pages/addcourse';
import EditCourse from './pages/editcourse';
import EditReport from './pages/editreport';
import ReportPage from './pages/reportpage';

import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

// This App here is for routing purposes
class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={Welcome}/>
        <Route exact path='/home' component={Home}/>

        <Route exact path='/edit/news/:id' component={EditNews}/>
        <Route exact path='/edit/user/:id' component={EditUser}/>
        <Route exact path='/edit/course/:id' component={EditCourse}/>
        <Route exact path='/edit/report/:id' component={EditReport}/>

        <Route exact path='/reports/:id' component={ReportPage}/>

        <Route path='/profile/:profileid' component={Profile}/>

        <Route exact path='/add/news' component={AddNews}/>
        <Route exact path='/add/user' component={AddUser}/>
        <Route exact path='/add/course' component={AddCourse}/>
        <Route exact path='/add/report' component={AddReport}/>
      </Switch>
    );
  }
}

export default App;
