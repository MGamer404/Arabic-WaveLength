import { useEffect, useState } from 'react';
import { socket } from './socket';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import GameRoom from './pages/GameRoom';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [room, setRoom] = useState(null);
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }
    function onDisconnect() {
      setIsConnected(false);
      setRoom(null);
    }
    function onRoomUpdate(roomData) {
      setRoom(roomData);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('room_update', onRoomUpdate);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('room_update', onRoomUpdate);
    };
  }, []);

  return (
    <div dir="rtl" className="min-h-screen flex flex-col bg-slate-900 text-slate-100 font-sans p-4 antialiased overflow-x-hidden">
      <header className="fixed top-4 left-4 right-4 flex justify-between items-center z-50 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-slate-800/80 backdrop-blur block px-3 py-1.5 rounded-full border border-slate-700/50">
          <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-xs font-semibold text-slate-300 tracking-wide">
            {isConnected ? 'متصل بالخادم' : 'غير متصل'}
          </span>
        </div>

        {room && (
          <button
            onClick={() => {
              socket.disconnect();
              socket.connect();
              setRoom(null);
            }}
            className="pointer-events-auto text-xs font-bold text-red-400 bg-slate-800/80 px-3 py-1.5 rounded-full hover:bg-red-900/30 transition border border-red-900/30 cursor-pointer"
          >
            مغادرة
          </button>
        )}
      </header>

      <main className="flex-grow flex flex-col items-center justify-center pt-16 pb-8 w-full max-w-5xl mx-auto">
        {!room && (
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-br from-brand-400 via-brand-500 to-accent-400 bg-clip-text text-transparent drop-shadow-sm pb-2">
              ويف لينغث
            </h1>
            <p className="text-lg md:text-xl text-slate-400 max-w-lg mx-auto text-balance leading-relaxed">
              لعبة تعاونية تعتمد على التخاطر وقراءة أفكار فريقك للوصول إلى الهدف!
            </p>
          </div>
        )}

        {!room ? (
          <Home setPlayerName={setPlayerName} />
        ) : room.gameState.phase === 'lobby' ? (
          <Lobby room={room} playerName={playerName} />
        ) : (
          <GameRoom room={room} playerName={playerName} />
        )}
      </main>
    </div>
  );
}

export default App;
