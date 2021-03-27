import React, { Component } from 'react';
import { Button, Modal } from 'semantic-ui-react';

import "../Modal/Modal.css"
import FormPlaylist from '../FormPlaylist/FormPlaylist';

class ModalPlaylist extends Component {

  render() {
    return (
    <div className={this.props.modalon ? "new-modal-container" : "modal-off"} >
    <div className="new-modal-central-part">
        <span className="new-modal-close-button" onClick={this.props.closeModal}>X</span>
        <p>{this.props.content}</p>
    </div>
</div>
      // <Modal
      //   trigger={<Button color={this.props.buttonColor}>{this.props.buttonTriggerTitle}</Button>}
      //   dimmer='inverted'
      //   size='tiny'
      //   closeIcon='close'
      // >
      //   <Modal.Header>{this.props.headerTitle}</Modal.Header>
      //   <Modal.Content>
      //     <FormPlaylist
      //       buttonSubmitTitle={this.props.buttonSubmitTitle}
      //       buttonColor={this.props.buttonColor}
      //       // playlistID={this.props.playlistID}
      //       onPlaylistAdded={this.props.onPlaylistAdded}
      //       onPlaylistUpdated={this.props.updatePlaylists}
      //       server={this.props.server}
      //       socket={this.props.socket}
      //     />
      //   </Modal.Content>
      // </Modal>
    );
  }
}

export default ModalPlaylist;
