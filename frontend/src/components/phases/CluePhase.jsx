import { useState } from 'react';
import { socket } from '../../socket';

export default function CluePhase({ room, isClueGiver, clueGiverName }) {
    const [localClue, setLocalClue] = useState('');

    const handleClueSubmit = (e) => {
        e.preventDefault();
        if (!localClue.trim()) return;
        socket.emit('submit_clue', { roomId: room.id, clue: localClue });
    };

    return (
        <div className="w-full flex justify-center mt-12 min-h-[100px] animate-in fade-in duration-500">
            {isClueGiver ? (
                <form onSubmit={handleClueSubmit} className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl max-w-lg w-full text-center">
                    <h2 className="text-2xl font-bold mb-2">أنت مقدم الدليل</h2>
                    <p className="text-slate-400 mb-6 font-medium text-balance">الهدف موضح على المؤشر. أعط فريقك دليلاً يقع تماماً في هذا الموقع على المقياس.</p>
                    <input
                        type="text"
                        autoFocus
                        value={localClue}
                        onChange={(e) => setLocalClue(e.target.value)}
                        placeholder="اكتب الدليل هنا..."
                        className="w-full bg-slate-900 border border-brand-500/50 rounded-xl px-4 py-4 text-white text-xl font-bold text-center focus:outline-none focus:border-brand-400 mb-6 drop-shadow-sm"
                    />
                    <button type="submit" className="w-full py-4 bg-brand-600 hover:bg-brand-500 transition shadow-lg shadow-brand-500/20 rounded-xl font-bold text-xl cursor-pointer">
                        إرسال الدليل
                    </button>
                </form>
            ) : (
                <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700 shadow-2xl text-center min-w-[300px]">
                    <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">في انتظار الدليل...</h2>
                    <p className="text-slate-400">{clueGiverName} يقوم بالتفكير في الدليل المثالي!</p>
                </div>
            )}
        </div>
    );
}
