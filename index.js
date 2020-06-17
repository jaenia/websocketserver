const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').Server(app);
const io = require('socket.io')(http);

const corsOptions = {
  origin: 'https://githubrepomonitor.herokuapp.com',
  optionsSuccessStatus: 200,
};

io.on('connection', function(socket) {
  socket.on('ping', function(msg) {
    console.log('ping' + msg);
    socket.emit('ping', 'pong');
  });
});

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) => res.send('OK!'))

app.post('/send-msg', cors(corsOptions), function(req, res) {
  const { username, repo } = req.body;
  console.log('SENDING MSG TO', username);
  io.emit(username, `New commits were pushed to your repository ${repo}`);

  return res.send('OK');
})

http.listen(process.env.PORT || 3030, function() {
  console.log('Service running');
});
