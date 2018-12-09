const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const Pusher = require('pusher');

// -------------------------
// Need to create new Pusher app for credentials before server start
// -------------------------

const pusher = new Pusher({
  appId: '',
  key: '',
  secret: '',
  cluster: '',
  encrypted: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

// API route for chat messages
app.post('/message/send', (req, res) => {
  // private channel prefix
  pusher.trigger('private-reactchat', 'messages', {
    message: req.body.message,
    username: req.body.username
  });
  res.sendStatus(200);
});

// API route for Pusher auth
app.push('/pusher/auth', (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const auth = pusher.authenticate(socketId, channel);
  res.send(auth);
});

app.set('port', (process.env.PORT || 5000));

app.listen(app.get('port'), function () {
  console.log('Node app is running on port', app.get('port'));
});