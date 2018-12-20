import React, { Component } from 'react';
import Chat from './Chat.js';
import './Chat.css';
import { Grid, Row, Col } from 'react-bootstrap';
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
      show_prompt: false,
      room_id: null
    };
    this.sendMessage = this.sendMessage.bind(this);
    this.handleChange = this.handleChange.bind(this);
    
    this.channel = null;
    this.is_channel_bound = null;
    this.onPressCreateRoom = this.onPressCreateRoom.bind(this);
    this.onPressJoinRoom = this.onPressJoinRoom.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.onCancelJoinRoom = this.onCancelJoinRoom.bind(this);
    this.simulateJoin = this.simulateJoin.bind(this);
  }

  // Methods for channels

  simulateJoin() {
    this.setState({
      room_id: 1234
    })
  }

  onPressCreateRoom() {
    let room_id = shortid.generate();
    this.channel = this.pusher.subscribe('private-' + room_id);
    this.setState({
      room_id: room_id
    })

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
        {
          this.state.room_id === null ? 
            <Row className="show-grid">
            <input className="btn btn-primary" value="Join Channel" onClick={() => { this.simulateJoin() }}/>
            <h4 className="text-center">Welcome, {this.state.username}</h4>
            <h5 className="text-center">Start a conversation.</h5>
            </Row>
            :
            <Chat />
        } 
      </Grid>
    )
  }
}

export default Main;