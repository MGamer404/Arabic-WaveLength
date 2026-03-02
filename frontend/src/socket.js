import { io } from 'socket.io-client';


const URL = import.meta.env.PROD ? 'https://arabic-wavelength-1.onrender.com' : 'http://localhost:3001';

export const socket = io(URL, {
    autoConnect: true,
});
