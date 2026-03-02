const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const GameRoom = require('./utils/GameRoom');

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

const PORT = process.env.PORT || 3001;

// Stores current active rooms mapped by ID to GameRoom class instances
const rooms = new Map();

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('join_room', ({ roomId, playerName }) => {
        socket.join(roomId);

        if (!rooms.has(roomId)) {
            rooms.set(roomId, new GameRoom(roomId, socket.id));
        }

        const room = rooms.get(roomId);
        room.addPlayer(socket.id, playerName);

        io.to(roomId).emit('room_update', room.toJSON());
    });

    socket.on('update_settings', ({ roomId, settings }) => {
        const room = rooms.get(roomId);
        if (room && room.hostId === socket.id) {
            room.updateSettings(settings);
            io.to(roomId).emit('room_update', room.toJSON());
        }
    });

    socket.on('start_game', ({ roomId }) => {
        const room = rooms.get(roomId);
        if (room && room.hostId === socket.id) {
            room.startGame();
            io.to(roomId).emit('room_update', room.toJSON());
        }
    });

    socket.on('submit_clue', ({ roomId, clue }) => {
        const room = rooms.get(roomId);
        if (room) {
            room.submitClue(socket.id, clue);
            io.to(roomId).emit('room_update', room.toJSON());
        }
    });

    socket.on('update_guess', ({ roomId, angle }) => {
        const room = rooms.get(roomId);
        if (room && room.gameState.phase === 'guess') { // minor check to save bandwidth
            room.updateGuess(angle);
            socket.to(roomId).emit('guess_updated', angle);
        }
    });

    socket.on('lock_guess', ({ roomId, finalAngle }) => {
        const room = rooms.get(roomId);
        if (room) {
            room.lockGuess(finalAngle);
            io.to(roomId).emit('room_update', room.toJSON());
        }
    });

    socket.on('next_round', ({ roomId }) => {
        const room = rooms.get(roomId);
        if (room) {
            room.nextRound();
            io.to(roomId).emit('room_update', room.toJSON());
        }
    });

    socket.on('play_again', ({ roomId }) => {
        const room = rooms.get(roomId);
        if (room && room.hostId === socket.id) {
            room.playAgain();
            io.to(roomId).emit('room_update', room.toJSON());
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        for (const [roomId, room] of rooms.entries()) {
            const isPlayerInRoom = room.players.some(p => p.id === socket.id);
            if (isPlayerInRoom) {
                room.removePlayer(socket.id);

                if (room.players.length === 0) {
                    rooms.delete(roomId);
                } else {
                    io.to(roomId).emit('room_update', room.toJSON());
                }
            }
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
