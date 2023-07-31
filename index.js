// this is index node server
const http = require("http");
const express = require("express");

const app = express();

const index = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(express.static(__dirname+'/public'));

app.get('/',(req,res)=>{
  res.sendFile(__dirname+'/index.html');
});

// socket on

const io = require("socket.io")(index);

var users={};

io.on("connection",(socket) =>{
  socket.on("new-user-joined",(username)=>{
    users[socket.id]=username;
    socket.broadcast.emit('user-connected',username);
    io.emit("user-list",users);
  });

   socket.on("disconnect",()=>{
    socket.broadcast.emit('user-disconnected',user=users[socket.id]);
    delete users[socket.id];
    io.emit("user-list",users);
   });

   socket.on('msg',(data)=>{

     socket.broadcast.emit("msg",{user: data.user,msg:data.msg});
    
    
    });  
});


// socket end

index.listen(port,() =>{
  console.log("index started at"+port);
});
 