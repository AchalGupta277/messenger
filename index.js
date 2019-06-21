const express=require('express');
const socket=require('socket.io');

var app=express();

var server=app.listen(process.env.port || 4000,function(){
    console.log("App is running");
});


app.use(express.static("public"));

var globalSocket;
var io=socket(server);
io.on("connection",function(socket){
    globalSocket=socket;
});

app.get('/api/thread',function(req,res){
    
    let threadId=req.query.id;

    globalSocket.join(threadId,function(){
        console.log(`user joined in room ${threadId}`);
        io.to(threadId).emit(`user joined in ${threadId}`);
    });
    globalSocket.to(threadId).emit(`user joined`,{message:`in ${threadId}`});

    globalSocket.on('hit',function(data){
        globalSocket.to(threadId).emit('hit',{message:`socket hit`}); 
    });
    res.send(`Running ${threadId}`);
});
