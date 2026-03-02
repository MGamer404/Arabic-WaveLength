export default function HUD({ room }) {
    const { gameState, settings, players } = room;
    const clueGiverName = players[gameState.clueGiverIndex]?.name;

    return (
        <div className="w-full flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 mb-8 max-w-4xl shadow-md">
            <div className="text-center w-1/4">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">الجولة / الدور</p>
                <p className="text-2xl font-black text-white">
                    {gameState.turn} <span className="text-slate-500 text-sm">/ {settings.totalRounds * Math.max(1, players.length)}</span>
                </p>
            </div>
            <div className="text-center px-8 shrink-0 w-1/2">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-loose">النتيجة الإجمالية</p>
                <div className="text-3xl font-black text-accent-400">
                    {gameState.score} <span className="text-slate-500 text-sm">/ {gameState.targetScore} للعبور</span>
                </div>
            </div>
            <div className="text-center w-1/4">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">مقدم الدليل الموجه</p>
                <p className="text-lg font-bold text-brand-400 drop-shadow-md truncate px-2">{clueGiverName}</p>
            </div>
        </div>
    );
}
