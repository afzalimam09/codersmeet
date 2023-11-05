import { Server } from "socket.io";
import { ACTIONS } from "../actions.js";
let io;

const socketUserMapping = {};

// Define a function for initializing the Socket.IO server
export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ["GET", "POST"],
        },
    });
    // Set up a listener for the "connection" event, triggered when a new client connects
    io.on("connection", (socket) => {
        console.log(`Client with socket id ${socket.id} connected`);

        socket.on(ACTIONS.JOIN, ({ roomId, user }) => {
            socketUserMapping[socket.id] = user;

            // new map
            const clients = Array.from(
                io.sockets.adapter.rooms.get(roomId) || []
            );
            clients.forEach((clientId) => {
                io.to(clientId).emit(ACTIONS.ADD_PEER, {
                    peerId: socket.id,
                    createOffer: false,
                    user,
                });

                socket.emit(ACTIONS.ADD_PEER, {
                    peerId: clientId,
                    createOffer: true,
                    user: socketUserMapping[clientId],
                });
            });

            socket.join(roomId);
        });

        //handle relay ice
        socket.on(ACTIONS.RELAY_ICE, ({ peerId, icecandidate }) => {
            io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
                peerId: socket.id,
                icecandidate,
            });
        });

        // handle relay sdp (session description)
        socket.on(ACTIONS.RELAY_SDP, ({ peerId, sessionDescription }) => {
            io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
                peerId: socket.id,
                sessionDescription,
            });
        });

        //handle mute/unmute
        socket.on(ACTIONS.MUTE, ({ roomId, userId }) => {
            const clients = Array.from(
                io.sockets.adapter.rooms.get(roomId) || []
            );
            clients.forEach((clientId) => {
                io.to(clientId).emit(ACTIONS.MUTE, {
                    peerId: socket.id,
                    userId,
                });
            });
        });
        socket.on(ACTIONS.UN_MUTE, ({ roomId, userId }) => {
            const clients = Array.from(
                io.sockets.adapter.rooms.get(roomId) || []
            );
            clients.forEach((clientId) => {
                io.to(clientId).emit(ACTIONS.UN_MUTE, {
                    peerId: socket.id,
                    userId,
                });
            });
        });

        // leaving the room
        const leaveRoom = ({ roomId }) => {
            const { rooms } = socket;
            Array.from(rooms).forEach((roomId) => {
                const clients =
                    Array.from(io.sockets.adapter.rooms.get(roomId)) || [];

                clients.forEach((clientId) => {
                    io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
                        peerId: socket.id,
                        userId: socketUserMapping[socket.id]._id,
                    });

                    socket.emit(ACTIONS.REMOVE_PEER, {
                        peerId: clientId,
                        userId: socketUserMapping[clientId]._id,
                    });
                });
                socket.leave(roomId);
            });
            delete socketUserMapping[socket.id];
        };
        socket.on(ACTIONS.LEAVE, leaveRoom);

        socket.on("disconnecting", leaveRoom); //disconnect on window close

        // Set up a listener for the "disconnect" event on each connected socket, triggered when a client disconnects
        socket.on("disconnect", (socket) => {
            console.log(`Cliend with socket id ${socket.id} disconnected`);
        });
    });
};
