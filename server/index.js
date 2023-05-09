const http = require('http')

const express = require("express")
const cors = require('cors')
const socketIO = require('socket.io')
const app =express();

PORT = process.env.PORT  || 2020

const users =[{}]
app.use(cors())
app.get('/',(req,res)=>{
    res.send("hello")
})

const server = http.createServer(app)
const io =socketIO(server)


io.on("connection",(socket)=>{
    socket.on('joined',({user})=>{
        users[socket.id] =user
        // console.log(` this is  a server ${user}`)
        socket.broadcast.emit('userJoined',{user:"Admin",message:`${users[socket.id]} has joined `})
        socket.emit('welcome',{user:"Admin",message:`Welcome to the chat ${users[socket.id]}`})
    })

    // chat message
   socket.on('message',({message , id})=>{
   io.emit('sendMessage',{user:users[id],message , id})
   })


    socket.on('disconnected',()=>{
        socket.broadcast.emit('leave',{user:"Admin", message:"User has left"})
        console.log(`${users[socket.id]} user left`)
    })

})
server.listen(PORT,()=>{
    console.log(`server is working on http://localhost:${PORT}`)
})