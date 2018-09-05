/**
 * http 启动服务
 */ 
const socketio = require("socket.io");
const http = require("http");
const fs = require("fs");
const path = require("path");
const port = 3333;

const server = http.createServer((req, res) => {
	if (req.url.indexOf("favicon.ico") !==-1 ) {
		return;
	}
	res.writeHead(200, {
		"Content-Type": "text/html;charset:utf-8;"
	})
	let pathname = "";
	if (req.url === "/") {
		pathname = __dirname + "/index.html";
	} else {
		pathname = path.join(__dirname, req.url);
	}
	res.end(fs.readFileSync(pathname));
}).listen(port);

let users = [];

// io 监听 服务
const io = socketio.listen(server);

// fs.writeFileSync('io.json', io, (data) => {
// 	console.log(data);
// });

console.log(io);
io.on("connection", socket => {
	// console.log(socket);
	socket.on("loginin",data => {
		if (users.indexOf(data) === -1 ) {
			users.push(data);
			socket.user = data;
			socket.emit("logina", " 登录成功 <br>");
			io.emit("getColor", "欢迎 " + data + " <br>");
			io.emit("load", users.length + " 人在线");
		} else {
			io.emit("loginno", " 已登录");
		}
	})
	socket.on("file", data => {
		// console.log(data);
		io.emit("simg", socket.user,data);
	})
	socket.on("setColor", data => {
		io.emit("getColor", socket.user + " 说: " + data + "<br>");
	})
	socket.on("disconnect", data => {
		if (!socket.user) return;
		users.splice(users.indexOf(socket.user), 1);
		console.log(data, 'disconnect', socket.user)
		io.emit("load", users.length + " 人在线 <br>" + socket.user + ' 已离线');
	})
})