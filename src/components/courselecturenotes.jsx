import '../css/courselecturenotes.css';
import React, { Component } from 'react';
import SureModal from '../components/suremodal';
import { MdDeleteForever } from 'react-icons/md';
import { getFromStorage } from '../utils/storage';
import { MdInsertDriveFile } from 'react-icons/md';
import TextField from '@material-ui/core/TextField';
import SuccessSnakeBar from '../components/successsnakebar';

const axios = require('axios');

export default class CourseLectureNotes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileTopic: '',
      lectureFiles: [],
      deletingFileId: '',
      openSureModal: false,
      openSnackBarSuccess: false,
    };
  }

  handleClose(event, reason) {
    if (reason === 'clickaway') return;
    this.setState({ openSnackBarSuccess: false });
  };

  async submit() {
    const { files } = document.getElementById("teacher-upload-file");
    if (!this.state.fileTopic) {
      alert('File topic must be filled');
      return;
    }
    if (!Boolean(files[0])) {
      alert('No file choosing');
      return;
    }
    const formData = new FormData();
    formData.append("data", files[0]);
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
    };
    try {
      const url = `/uploads/${this.props.courseId}/lecture/${this.props.user.userId}/${this.state.fileTopic}/file`;
      await axios.post(url, formData, config);
      await this.updateLectureFiles(this.props.courseId);
      this.setState({
        openSnackBarSuccess: true,
      }, () => {
        setTimeout(() => {
          this.setState({
            openSnackBarSuccess: false,
          });
        }, 1000);
      });
    } catch (err) {
      alert(err.message);
    }
  }

  async updateLectureFiles(courseId) {
    const params = {
      courseId,
      assignmentId: 'lecture',
    };
    const { data } = await axios.get('/api/courses/files', { params });
    this.setState({
      lectureFiles: data.files,
    });
  }

  async componentDidMount() {
    await this.updateLectureFiles(this.props.courseId);
  }

  async componentWillReceiveProps(props) {
    await this.updateLectureFiles(props.courseId);
  }

  onChange(name, event) {
    this.setState({
      [name]: event.target.value,
    });
  }

  async submitRemove(fileName) {
    const params = {
      id: fileName,
      token: getFromStorage('login_token'),
    };
    await axios.post('/uploads/delete', params);
    this.handleCloseSureModal();
    this.updateLectureFiles(this.props.courseId);
    this.setState({ openSnackBarSuccess: true }, () => {
      setTimeout(() => {
        this.setState({ openSnackBarSuccess: false });
      }, 1000);
    });
  }

  handleOpenSureModal(file) {
    this.setState({
      openSureModal: true,
      deletingFileId: file.fileName,
    });
  };

  handleCloseSureModal() {
    this.setState({ openSureModal: false });
  }

  render() {
    const { type } = this.props.user;
    return (
      <div>
        {type === 'teacher' &&
          <div id="teacher-upload">
            <h1>Upload file here</h1>

            <TextField
              id="teacher-upload-file-topic"
              label="File Topic"
              margin="normal"
              value={this.state.fileTopic}
              onChange={this.onChange.bind(this, 'fileTopic')}
            />

            <br/>
            <br/>

            <input
              type="file"
              id="teacher-upload-file"
            />
            <br/>
            <br/>

            <button onClick={this.submit.bind(this)}>Submit</button>
          </div>
        }

        {this.state.lectureFiles.map((file, index) =>
          <div
            key={`lecture-files-${index}`}
            className="file-upload-area"
            style={index % 2 === 0 ? { backgroundColor: '#FAFAFA' } : { backgroundColor: '#FFF1F1' } }
          >
            <a
              href={`/uploads/${file.fileName}`}
              download={file.fileOriginalName}
              className="file-upload-text"
            >
              <MdInsertDriveFile /> {file.fileTopic}
            </a>

            {type === 'teacher' &&
              <div
                className="remove-lecture-file-button"
                onClick={this.handleOpenSureModal.bind(this, file)}
              >
                <MdDeleteForever/>
              </div>
            }
          </div>
        )}

        <SureModal
          open={this.state.openSureModal}
          handleClose={this.handleCloseSureModal.bind(this)}
          message="Are you sure?"
          onClick={this.submitRemove.bind(this, this.state.deletingFileId)}
        />

        <SuccessSnakeBar
          open={this.state.openSnackBarSuccess}
          handleClose={this.handleClose.bind(this)}
          message="SUCCESS UPLOADED"
        />

      </div>
    );
  }
}
