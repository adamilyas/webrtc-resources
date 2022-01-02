"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const port = 4001 || process.env.PORT;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
    },
});
app.use((0, cors_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
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
//# sourceMappingURL=app.js.map