import '../css/postmodal.css';
import React, { Component } from 'react';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import { MdAccountCircle, MdLightbulbOutline } from "react-icons/md";
import { GoBook } from "react-icons/go";

export default class PostModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  render() {
    return (
      <Modal
        open={this.props.open}
        onClose={this.props.handleClose}
      >
        <Paper id="post-modal">
          <MenuList className="post-modal-item">
            <MenuItem onClick={() => this.props.chooseOption('User')}>
              <MdAccountCircle />
              <ListItemText inset primary="Add new user"/>
            </MenuItem>
            <MenuItem onClick={() => this.props.chooseOption('Course')}>
              <GoBook />
              <ListItemText inset primary="Add new course" />
            </MenuItem>
            <MenuItem onClick={() => this.props.chooseOption('News')}>
              <MdLightbulbOutline />
              <ListItemText inset primary="Add news" />
            </MenuItem>
          </MenuList>
        </Paper>
      </Modal>
    );
  }
}
