import { socket } from '../../socket';

export default function GuessPhase({ room, isClueGiver, localGuess }) {
    const handleLockGuess = () => {
        socket.emit('lock_guess', { roomId: room.id, finalAngle: localGuess });
    };

    return (
        <div className="w-full flex justify-center mt-12 min-h-[100px] animate-in slide-in-from-bottom-4 duration-500">
            {!isClueGiver ? (
                <button
                    onClick={handleLockGuess}
                    className="px-12 py-4 bg-accent-600 hover:bg-accent-500 transition shadow-[0_0_30px_rgba(245,158,11,0.3)] rounded-2xl font-black text-2xl"
                >
                    تثبيت التوقع!
                </button>
            ) : (
                <div className="text-slate-400 font-medium text-lg animate-pulse py-4 text-center">
                    الفريق يتناقش ويحرك المؤشر...
                    <br /><span className="text-sm opacity-50">(لا يمكنك المشاركة في النقاش)</span>
                </div>
            )}
        </div>
    );
}
