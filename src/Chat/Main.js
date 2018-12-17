import React, { Component } from 'react';
import './Chat.css';
import { FormControl, Grid, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import shortid from 'shortid';
import Pusher from 'pusher-js';

class Main extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
      username: '',
      messages: [],
      show_prompt: false
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    
    this.channel = null;
    this.is_channel_bound = null;
    this.onPressCreateRoom = this.onPressCreateRoom.bind(this);
    this.onPressJoinRoom = this.onPressJoinRoom.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.onCancelJoinRoom = this.onCancelJoinRoom.bind(this);
  }

  // Methods for channels

  onPressCreateRoom() {
    let room_id = shortid.generate();
    this.channel = this.pusher.subscribe('private-' + room_id);

    // Push an alert with the room-id for others to join

    // alert.alert(
    //   'Share this room ID with those you want to join'
    // )
  }

  onPressJoinRoom() {
    this.state({
      show_prompt: true
    })
  }

  joinRoom(room_id) {
    this.channel = this.pusher.subscribe('private-' + room_id);
    this.channel.trigger('client-joined', {
      username: this.state.username
    });

    /* Save the room_id to the DB => user => channels
    for future access */

    this.setState({
      show_prompt: false
    })
  }

  onCancelJoinRoom() {
    this.setState({
      show_prompt: false
    });
  }

  // End of channel methods 

  componentWillMount() {
    this.setState({ username: localStorage.username });
    this.pusher = new Pusher('6bb058bfde52c0ed935c', {
      authEndpoint: '/pusher/auth',
      cluster: 'us2',
      encrypted: true
    });
    this.chatRoom = this.pusher.subscribe('private-reactchat');
  }

  componentDidMount() {
    this.chatRoom.bind('messages', newmessage => {
      this.setState({ messages: this.state.messages.concat(newmessage )})
    }, this);
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  sendMessage(e) {
    e.preventDefault();
    if(this.state.value !== '') {
      axios.post('/message/send', {
        username: this.state.username,
        message: this.state.value
      })
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      })
    this.setState({ value: '' });
    }
    else {
      //
    }
  }

  render() {
    const messages = this.state.messages;
    const message = messages.map(item => {
      return (
        <Grid>
          {message}
          <Row className="show-grid">
            <Col xs={12}>
              <div className="chatmessage-container">
                <div key={item.id} className="message-box">
                  <p><strong>{item.username}</strong></p>
                  <p>{item.message}</p>
                </div>
              </div>
            </Col>
          </Row>
        </Grid>
      )
    })
    return (
      <Grid>
        { /* Join and Create room buttons */ }
        <Row className="show-grid">
        { /* Render a list of channels from db => user => channels */ }
          <Col xs={12}>
            {message}
            <div className="chat-container">
              <form onSubmit={this.sendMessage}>
                <Col xs={5} xsOffset={3}>
                  <FormControl
                    type="text"
                    value={this.state.value}
                    placeholder="Enter message here"
                    onChange={this.handleChange}
                  />
                </Col>
                <Col xs={4}>
                  <input className="btn btn-primary" value="Send" type="submit" />
                </Col>
              </form>
              <h4 className="text-center">Welcome, {this.state.username}</h4>
              <h5 className="text-center">Start a conversation.</h5>
            </div>
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default Main;