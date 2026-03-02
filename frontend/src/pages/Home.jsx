import { useState } from 'react';
import { socket } from '../socket';

export default function Home({ setPlayerName }) {
    const [name, setName] = useState('');
    const [roomId, setRoomId] = useState('');

    const generateRoomId = () => {
        return Math.random().toString(36).substring(2, 6).toUpperCase();
    };

    const handleCreateRoom = (e) => {
        e.preventDefault();
        if (!name.trim()) return alert('الرجاء إدخال اسمك أولاً');
        const newRoomId = generateRoomId();
        setPlayerName(name);
        socket.emit('join_room', { roomId: newRoomId, playerName: name });
    };

    const handleJoinRoom = (e) => {
        e.preventDefault();
        if (!name.trim()) return alert('الرجاء إدخال اسمك أولاً');
        if (!roomId.trim()) return alert('الرجاء إدخال رمز الغرفة');
        setPlayerName(name);
        socket.emit('join_room', { roomId: roomId.toUpperCase(), playerName: name });
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto space-y-8 mt-12 bg-slate-800/50 p-8 rounded-3xl border border-slate-700/50 shadow-2xl backdrop-blur-sm">
            <div className="w-full relative">
                <label className="block text-slate-400 mb-2 font-medium">اسم اللاعب</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="أدخل اسمك هنا..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500 transition-colors"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Create Room */}
                <div className="flex flex-col space-y-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
                    <h3 className="font-bold text-lg text-brand-400">غرفة جديدة</h3>
                    <p className="text-sm text-slate-400 flex-grow">العب مع أصدقائك وكن أنت المضيف.</p>
                    <button
                        onClick={handleCreateRoom}
                        className="w-full py-3 bg-brand-600 hover:bg-brand-500 rounded-xl font-bold transition shadow-lg shadow-brand-500/20"
                    >
                        إنشاء غرفة
                    </button>
                </div>

                {/* Join Room */}
                <div className="flex flex-col space-y-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
                    <h3 className="font-bold text-lg text-accent-400">الانضمام لغرفة</h3>
                    <input
                        type="text"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        placeholder="رمز الغرفة (مثال: A1B2)"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-center tracking-widest uppercase focus:outline-none focus:border-accent-500"
                        maxLength={6}
                    />
                    <button
                        onClick={handleJoinRoom}
                        className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold transition"
                    >
                        انضمام
                    </button>
                </div>
            </div>
        </div>
    );
}
