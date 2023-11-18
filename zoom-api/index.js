const express = require("express");
const app= express();
const server=require("http").Server(app);
const io=require("socket.io")(server);

const port =3001
let users=[];
app.get("/",(req,res)=>{
    res.send("hellow world")
})
const addUser=(userName,roomId)=>{
    users.push({
        userName:userName,
        roomId:roomId,
    })
}
const userLeave=(userName)=>{
    users=users.filter(user=>user.userName!=userName)
}
const getRoomUsers=(roomId)=>{
    return users.filter(user=>(user.roomId==roomId))
}
io.on("connection",socket=>{
    console.log("Someone Connected");
    socket.on("join-room",({roomId,userName})=>{
        console.log("User Joined room");
        console.log(roomId);
        console.log(userName);
        if(roomId && userName){
        socket.join(roomId);
        addUser(userName,roomId);
    //every single user that is not me will be informed that i am connected to this room
        socket.to(roomId).emit("user-connected",userName);
//everyone including me will be informed hey all the users are here
   
        io.to(roomId).emit("all-users",getRoomUsers(roomId))
        }
        socket.on("disconnect",()=>{
            console.log("disconnected");
            socket.leave(roomId);
            userLeave(userName);
            io.to(roomId).emit("all-users",getRoomUsers(roomId));
            
        })
    })
})
server.listen(port,()=>{
    console.log("zoom clone api localhost 3001");
})