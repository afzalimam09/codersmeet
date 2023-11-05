import http from "http";
import app from "../app.js";
import { initSocket } from "../socket/socket.js";

if (process.env.NODE_ENV === "production") {
    process.on("uncaughtException", (err) => {
        console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
        console.error(err.name, err.message);
        process.exit(1);
    });
}

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}
const port = normalizePort(process.env.PORT || "5000");

const server = http.createServer(app);
app.set("port", port);

initSocket(server);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

function onError(error) {
    //Checks if the error is related to the listen system call
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

    switch (error.code) {
        case "EACCES": //when the server does not have the required permissions to start listening on the specified port
            console.log(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case "EADDRINUSE": //when the specified port is already in use
            console.log(`${bind} + is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind =
        typeof addr === "string" ? `Pipe ${addr}` : `Port ${addr.port}`;
    console.log(`Server started on port : ${port}`);
    console.log(`Listening on ${bind}`);
}

process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});

process.on("SIGTERM", () => {
    console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
    server.close(() => {
        console.log("💥 Process terminated!");
    });
});
