const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const corsOptions = {
  origin: 'https://githubrepomonitor.herokuapp.com',
  optionsSuccessStatus: 200,
};

app.get('/', (req, res) => res.send('OK!'))

app.post('/send_msg', cors(corsOptions), function(req, res) {
  const { body } = req;
  const { username } = body;
  const { repo } = body;

  io.emit(username, `New commits were pushed to your repository ${repo}`);

  return res.send('OK');
})

io.on('connection', function(socket) {
  socket.on('ping', function(msg) {
    console.log('ping' + msg);
    io.emit('ping', 'pong');
  });
});

app.use(express.json())
//io.origins([corsOptions.origin])

http.listen(process.env.PORT || 3000, function() {
  console.log('Service running in: http://localhost:3000');
});
