import React from "react"
import "./Modal.css"
import FormPlaylist from '../FormPlaylist/FormPlaylist'
export default class Modal extends React.Component {

    render() {
        return (
            <div className={this.props.modalon ? "new-modal-container" : "modal-off"} >
                <div className="new-modal-central-part">
                    <span className="new-modal-close-button" onClick={this.props.closeModal}>X</span>
                    <p><FormPlaylist
            // buttonSubmitTitle={this.props.buttonSubmitTitle}
            // buttonColor={this.props.buttonColor}
            // playlistID={this.props.playlistID}
            onPlaylistAdded={this.props.onPlaylistAdded}
            onPlaylistUpdated={this.props.updatePlaylists}
            // server={this.props.server}
            // socket={this.props.socket}
          /></p>
                </div>
            </div>
        )
    }
}