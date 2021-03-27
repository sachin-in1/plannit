import React, { Component } from 'react';
import { Message, Button, Form, Select } from 'semantic-ui-react';
import axios from 'axios';

const listTypeOptions = [
  { key: 'playlist', text: 'Playlist', value: 'playlist' },
  { key: 'account', text: 'User Uploads', value: 'user_uploads' },
  // { key: 'o', text: 'Do Not Disclose', value: 'o' }
]

class FormPlaylist extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      list: '',
      listtype: '',
      formClassName: '',
      formSuccessMessage: '',
      formErrorMessage: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
    // Fill in the form with the appropriate data if user id is provided
    if (this.props.playlistID) {
      axios.get(`/playlists/${this.props.playlistID}`)
      .then((response) => {
        this.setState({
          list: response.data.list,
          listtype: response.data.listtype,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }

  handleInputChange(e) {
    const target = e.target;
    this.setState({list: target.value});
    const list = target.list;
    console.log(list);
  }

  handleSelectChange(e, data) {
    console.log(data.value);
    this.setState({ listtype: data.value });
  }

  handleSubmit(e) {
    // Prevent browser refresh
    e.preventDefault();

    const playlist = {
      list: this.state.list,
      listtype: this.state.listtype
    }
    this.props.onPlaylistAdded(playlist);

    // Acknowledge that if the user id is provided, we're updating via PUT
    // Otherwise, we're creating a new data via POST
    // const method = this.props.playlistID ? 'put' : 'post';
    // const params = this.props.playlistID ? this.props.playlistID : '';
// 
    const method = 'post';
    const params = '';

    axios({
      method: method,
      responseType: 'json',
      url: `/playlist/${params}`,
      data: playlist
    })
    .then((response) => {
      this.setState({
        formClassName: 'success',
        formSuccessMessage: response.data.msg
      });

      // if (!this.props.playlistID) {
      //   this.setState({
      //     list: '',
      //     listtype: ''
      //   });
      //   // this.props.socket.emit('add', response.data.result);
      // }
      // else {
      //   this.props.onPlaylistUpdated(response.data.result);
      //   // this.props.socket.emit('update', response.data.result);
      // }
      
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.data) {
          this.setState({
            formClassName: 'warning',
            formErrorMessage: err.response.data.msg
          });
        }
      }
      else {
        this.setState({
          formClassName: 'warning',
          formErrorMessage: 'Something went wrong. ' + err
        });
      }
    });
  }

  render() {

    const formClassName = this.state.formClassName;
    const formSuccessMessage = this.state.formSuccessMessage;
    const formErrorMessage = this.state.formErrorMessage;

    return (
      <Form className={formClassName} onSubmit={this.handleSubmit}>
        <Form.Input
          label='List'
          type='text'
          placeholder='Playlist'
          name='list'
          maxLength='40'
          required
          value={this.state.list}
          onChange={this.handleInputChange}
        />
        <Form.Group widths='equal'>
          <Form.Field
            control={Select}
            label='List type'
            options={listTypeOptions}
            placeholder='List Type'
            value={this.state.listtype}
            onChange={this.handleSelectChange}
          />
        </Form.Group>
        <Message
          success
          color='green'
          header='Nice one!'
          content={formSuccessMessage}
        />
        <Message
          warning
          color='yellow'
          header='Woah!'
          content={formErrorMessage}
        />
        <Button color={this.props.buttonColor} floated='right'>{this.props.buttonSubmitTitle}</Button>
        <br /><br /> {/* Yikes! Deal with Semantic UI React! */}
      </Form>
    );
  }
}

export default FormPlaylist;
