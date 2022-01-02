import path from "path";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const port = 4001 || process.env.PORT;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"],
	},
});

app.use(cors());
app.use(express.static(path.join(__dirname, "../public")));

app.get("/_health", (req, res) => {
	res.send("Hello World!");
});

io.on("connection", (socket) => {
	console.log("New WS Connection");

	socket.on("message", (msg) => {
		console.log(msg);

		io.emit("message", msg);
	});
});

server.listen(port, () => {
	return console.log(`Express is listening at http://localhost:${port}`);
});
