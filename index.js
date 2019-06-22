const express=require('express');
const socket=require('socket.io');

var app=express();

var server=app.listen(process.env.port || 4000,function(){
    console.log("App is running");
});

app.use(express.static("public"));

var io=socket(server);

let userRoomMapping=[];

io.on("connection",function(socket){
    socket.on('user-joined',function(data){
        let threadId=data.roomId;
        let userName=data.name;
        userRoomMapping[userName]=threadId;
        console.log('user room',userRoomMapping);
        socket.join(threadId,function(){
            console.log(`user joined in room ${threadId}`);
            socket.nsp.to(threadId).emit(`user joined in ${threadId}`);
        });
    });
    socket.on('message',function(data){
        userName=data.name;
        let threadId=userRoomMapping[userName];

        console.log('room',threadId,'user room',userRoomMapping);
        if(threadId!= null){
            socket.nsp.to(threadId).emit('message',{message:data.text,name:data.name});
        }
    })
});

app.get('/api/thread',function(req,res){
    let threadId=req.query.id;
    let name=req.query.name;
    if(name==''){
        name='Anonymous';
    }
    userName=name;
    res.send(`Running ${threadId}`);
});
