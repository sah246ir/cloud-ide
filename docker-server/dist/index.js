"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clients = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_headers_1 = require("./Middlewares/cors-headers");
const dotenv_1 = require("dotenv");
const ws_1 = require("ws");
const pty = __importStar(require("node-pty"));
const fs = __importStar(require("fs"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
exports.clients = (process.env.CLIENTS || "").split(",");
app.use((0, cors_1.default)({
    origin: '*',
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cors_headers_1.corsHeaders);
const HOMEDIR = process.cwd() + "/app";
app.get("/files", async (req, res) => {
    const filechildren = getFileTree(HOMEDIR, []);
    const filestructure = filechildren;
    return res.json({
        fs: filestructure
    });
});
app.post("/files/content", async (req, res) => {
    const params = req.body;
    if (!params.path) {
        return res.json({});
    }
    const content = fs.readFileSync(process.cwd() + "/" + params.path, {
        encoding: "utf-8"
    });
    return res.json({
        content
    });
});
const getFileTree = (path, filestructure) => {
    const appdir = fs.readdirSync(path);
    for (let file of appdir) {
        const filepath = path + "/" + file;
        if (fs.statSync(filepath).isDirectory()) {
            const files = getFileTree(filepath, []);
            filestructure.push({
                name: file,
                type: "folder",
                children: files
            });
        }
        else {
            const [name, ext] = file.split(".");
            filestructure.push({
                name: name,
                type: ext || ""
            });
        }
    }
    return filestructure;
};
const server = app.listen(process.env.PORT, () => {
    console.log("server listening on http://localhost:" + process.env.PORT);
});
const Socket = new ws_1.WebSocketServer({
    server
});
const Shell = pty.spawn("bash", [], {
    name: "xterm-color",
    cols: 80,
    rows: 30,
    cwd: HOMEDIR,
    env: process.env,
    encoding: "utf-8"
});
Shell.onData((data) => {
    Socket.clients.forEach(client => {
        const resjson = {
            type: "terminal:output",
            data: data
        };
        if (client.OPEN) {
            client.send(JSON.stringify(resjson));
        }
    });
});
Socket.on('connection', async (ws) => {
    console.log("client connected");
    ws.on('message', (data) => {
        const json = JSON.parse(data);
        if (json.type === "terminal:command") {
            Shell.write(json.data);
        }
        else if (json.type === "file:write" && 'path' in json) {
            fs.writeFileSync(process.cwd() + "/" + json.path, json.data);
        }
    });
});
