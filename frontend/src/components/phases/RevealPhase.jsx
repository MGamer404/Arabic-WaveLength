import { socket } from '../../socket';

export default function RevealPhase({ room, isHost }) {
    const { gameState } = room;

    const handleNextRound = () => {
        socket.emit('next_round', { roomId: room.id });
    };

    return (
        <div className="w-full flex justify-center mt-12 min-h-[100px] animate-in zoom-in duration-500">
            <div className="flex flex-col items-center space-y-6">
                <div className="text-center">
                    <p className="text-slate-400 font-bold mb-1 tracking-widest">النقاط المكتسبة</p>
                    <div className="text-6xl font-black text-green-400 drop-shadow-sm pb-1">+{gameState.lastScoreEarned}</div>
                </div>

                {isHost ? (
                    <button
                        onClick={handleNextRound}
                        className="px-10 py-3 bg-brand-600 hover:bg-brand-500 transition shadow-lg shadow-brand-500/20 rounded-xl font-bold text-xl cursor-pointer"
                    >
                        الجولة التالية
                    </button>
                ) : (
                    <div className="text-slate-500 font-medium bg-slate-800/50 px-6 py-3 rounded-full border border-slate-700/50">
                        في انتظار المضيف للانتقال للجولة التالية
                    </div>
                )}
            </div>
        </div>
    );
}
