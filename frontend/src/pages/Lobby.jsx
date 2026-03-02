import { socket } from '../socket';

export default function Lobby({ room, playerName }) {
    const isHost = room.hostId === socket.id;

    const handleSettingChange = (e) => {
        const value = parseInt(e.target.value);
        socket.emit('update_settings', {
            roomId: room.id,
            settings: { ...room.settings, totalRounds: value }
        });
    };

    const handleStartGame = () => {
        socket.emit('start_game', { roomId: room.id });
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header Info */}
            <div className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700/50 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-brand-500 to-accent-500" />
                <p className="text-slate-400 font-medium mb-1">رمز الغرفة</p>
                <h2 className="text-5xl font-black tracking-widest text-white mb-2">{room.id}</h2>
                <p className="text-sm text-slate-500">شارك هذا الرمز مع أصدقائك للانضمام</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Players List */}
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
                    <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
                        <span>اللاعبون ({room.players.length})</span>
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    </h3>
                    <ul className="space-y-3">
                        {room.players.map((p) => (
                            <li key={p.id} className="flex items-center gap-3 bg-slate-900/50 px-4 py-3 rounded-xl">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${p.id === room.hostId ? 'bg-accent-500 text-slate-900' : 'bg-slate-700 text-white'}`}>
                                    {p.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium text-slate-200">{p.name} {p.id === socket.id && '(أنت)'}</span>
                                {p.id === room.hostId && (
                                    <span className="mr-auto text-xs font-bold text-accent-400 bg-accent-400/10 px-2 py-1 rounded-md">
                                        المضيف
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Game Settings */}
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 flex flex-col">
                    <h3 className="text-xl font-bold mb-4">إعدادات اللعبة</h3>

                    <div className="flex-grow space-y-6">
                        <div>
                            <label className="block text-slate-400 mb-2 font-medium">عدد الجولات</label>
                            {isHost ? (
                                <select
                                    value={room.settings.totalRounds}
                                    onChange={handleSettingChange}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-500"
                                >
                                    <option value={2}>2 جولات (سريع)</option>
                                    <option value={4}>4 جولات (عادي)</option>
                                    <option value={6}>6 جولات (طويل)</option>
                                </select>
                            ) : (
                                <div className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white">
                                    {room.settings.totalRounds} جولات
                                </div>
                            )}
                        </div>

                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center">
                            <span className="text-slate-400">النقاط المطلوبة للفوز</span>
                            <span className="font-bold text-2xl text-accent-400">{room.gameState.targetScore}</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-700/50">
                        {isHost ? (
                            <button
                                onClick={handleStartGame}
                                disabled={room.players.length < 2}
                                className="w-full py-4 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed transition shadow-lg shadow-brand-500/20 rounded-xl font-bold text-xl"
                            >
                                {room.players.length < 2 ? 'بانتظار لاعبين آخرين...' : 'بدء اللعبة!'}
                            </button>
                        ) : (
                            <div className="text-center text-slate-400 font-medium py-3">
                                بانتظار المضيف لبدء اللعبة...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
