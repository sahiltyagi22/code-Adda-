require('dotenv').config()
const path = require('path')


const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const messageFormat = require('./public/util/message')
const {userJoin , getCurrentUser,userLeave,getRoomUsers} = require('./public/util/users')


 

const app = express()
const server = http.createServer(app)
const io = socketio(server)


app.use(express.static( path.join(__dirname , "public")))

//  runs when client connects
io.on('connection' , socket=>{
    socket.on('joinRoom' , ({username , room})=>{
        const user = userJoin(socket.id, username,room)

        socket.join(user.room)

        // welcome current user
        socket.emit('message' , messageFormat('chatCord' , "welcome"))

// broadcast when the user connects
socket.broadcast
.to(user.room)
.emit('message' , messageFormat('chatCord' , `${user.username} has joined the chat`))

// Send users and room info
io.to(user.room).emit('roomUsers' , {
    room : user.room,
    users : getRoomUsers(user.room)
})

});





// listen for chat msg
socket.on('chatMessage' , msg=>{
    const user = getCurrentUser(socket.id)
    io.to(user.room).emit('message' , messageFormat( user.username, msg)) 
})


//  broadcast when the user disconnects
socket.on('disconnect' ,()=>{
    const user = userLeave(socket.id);

    if(user){
        io.to(user.room).emit('message' , messageFormat('chatCord' , ` ${user.username} has disconnected`))
   
        io.to(user.room).emit('roomUser' , {
            room : user.room,
            users : getRoomUsers(user.room)
        })
    
   
    }

 
})
})

let port = process.env.PORT

server.listen( port || 3000 , ()=>{
    console.log(`server is running on port ${port}`);
})
    
