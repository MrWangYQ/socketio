const socketio=require("socket.io");
const http=require("http");
const fs=require("fs");
const path=require("path");
const server=http.createServer((req,res)=>{
	if(req.url.indexOf("favicon.ico")!=-1){
		return;
	}
	res.writeHead(200,{
		"Content-Type":"text/html;charset:utf-8;"
	})
	let pathname="";
	if(req.url=="/"){
		pathname=__dirname+"/index.html";
	}else{
		pathname=path.join(__dirname,req.url);
	}
	res.end(fs.readFileSync(pathname));
}).listen(3333);
const io=socketio.listen(server);
let users=[];
io.on("connection",socket=>{
	socket.on("loginin",data=>{
		if(users.indexOf(data)==-1){
			users.push(data);
			socket.user=data;
			socket.emit("logina","登录成功");
			io.emit("getColor","欢迎"+data+"<br>");
			io.emit("load",users.length+"人在线");
		}else{
			io.emit("loginno","已登录");
		}
	})
	socket.on("file",data=>{
		// console.log(data);
		io.emit("simg",socket.user,data);
	})
	socket.on("setColor",data=>{
		io.emit("getColor",socket.user+"说:"+data+"<br>");
	})
	socket.on("disconnect",data=>{
		users.splice(users.indexOf(socket.user),1);
		io.emit("load",users.length+"人在线");
	})
})