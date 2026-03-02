import { socket } from '../../socket';

export default function GameOverPhase({ room, isHost }) {
    const { gameState } = room;
    const isWin = gameState.score >= gameState.targetScore;

    const handlePlayAgain = () => {
        socket.emit('play_again', { roomId: room.id });
    };

    return (
        <div className="flex flex-col items-center justify-center space-y-8 animate-in zoom-in duration-500 h-full py-12">
            <h1 className={`text-6xl md:text-8xl font-black ${isWin ? 'text-green-400 drop-shadow-[0_0_20px_rgba(74,222,128,0.5)]' : 'text-red-400'}`}>
                {isWin ? 'لقد فزتم!' : 'للأسف، خسرتم!'}
            </h1>

            <div className="bg-slate-800/80 p-10 rounded-3xl border border-slate-700/50 flex flex-col items-center shadow-2xl backdrop-blur-sm">
                <p className="text-xl text-slate-300 mb-4 font-bold tracking-widest uppercase">النتيجة النهائية</p>
                <div className="text-8xl font-black text-white mb-2">{gameState.score}</div>
                <p className="text-slate-400 text-lg">الهدف كان <span className="text-accent-400 font-bold">{gameState.targetScore}</span></p>
            </div>

            {isHost ? (
                <button
                    onClick={handlePlayAgain}
                    className="px-12 py-5 bg-brand-600 hover:bg-brand-500 transition shadow-[0_0_30px_rgba(59,130,246,0.3)] rounded-2xl font-black text-2xl mt-8"
                >
                    العب مرة أخرى بثيم جديد
                </button>
            ) : (
                <div className="text-slate-500 text-lg mt-8">في انتظار المضيف لبدء لعبة جديدة...</div>
            )}
        </div>
    );
}
