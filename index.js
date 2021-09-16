const express = require('express'); 
const app = express(); 
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server)
var CryptoJS = require("crypto-js");

// Static files
app.use(express.static(__dirname + '/html'));

app.get('/', (req, res) => { 
    res.sendFile(__dirname + "/html/index.html");
});

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('chat message', (msg) => {    
        if (msg == 'play'){
            io.emit('chat message', 'bust @' + bust() + 'x');
        }
    });

    socket.on('disconnect', () => {    
        console.log('user disconnected');  
    });
});



server.listen(3000, () => { 
    console.log('listening on *:3000'); 
});


// Do algo
let hash = "323941329073329";

function bust(){
    return gameResult( '0xc6e1eb510b31e06ed474df13d525fecd8ca81bd371232459ea156668d81c4e49', hash);
}


// Algo
const gameResult = (seed, salt) => {
    const nBits = 52; // number of most significant bits to use

    // 1. HMAC_SHA256(message=seed, key=salt)  
    const hmac = CryptoJS.HmacSHA256(seed, salt);
    seed = hmac.toString(CryptoJS.enc.Hex);

  // In 1 of 101 games the game crashes instantly.
  if (divisible(seed, 101))
      return 1;
      
    // 2. r = 52 most significant bits
    seed = seed.slice(0, nBits / 4);
    const r = parseInt(seed, 16);

    // 3. X = r / 2^52
    let X = r / Math.pow(2, nBits); // uniformly distributed in [0; 1)

    // 4. X = 99 / (1-X)
    X = 99 / (1 - X);

    // 5. return max(trunc(X), 100)
    const result = Math.floor(X + 1);
    return Math.max(1, (result / 100));
};

function divisible(hash, mod) {
  // We will read in 4 hex at a time, but the first chunk might be a bit smaller
  // So ABCDEFGHIJ should be chunked like  AB CDEF GHIJ
  var val = 0;

  var o = hash.length % 4;
  for (var i = o > 0 ? o - 4 : 0; i < hash.length; i += 4) {
      val = ((val << 16) + parseInt(hash.substring(i, i+4), 16)) % mod;
  }

  return val === 0;
}