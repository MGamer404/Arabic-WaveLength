import { io } from 'socket.io-client';

// Connect to the Express server running on port 3001
const URL = import.meta.env.PROD ? undefined : 'http://localhost:3001';

export const socket = io(URL, {
    autoConnect: true,
});
