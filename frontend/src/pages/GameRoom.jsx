import { useState, useEffect } from 'react';
import { socket } from '../socket';
import Dial from '../components/Dial';
import ContextCard from '../components/ContextCard';
import HUD from '../components/HUD';
import GameOverPhase from '../components/phases/GameOverPhase';
import CluePhase from '../components/phases/CluePhase';
import GuessPhase from '../components/phases/GuessPhase';
import RevealPhase from '../components/phases/RevealPhase';

export default function GameRoom({ room }) {
    const { gameState, players } = room;
    const isClueGiver = players[gameState.clueGiverIndex]?.id === socket.id;
    const clueGiverName = players[gameState.clueGiverIndex]?.name;
    const isHost = room.hostId === socket.id;

    // Real-time guess broadcast state
    const [localGuess, setLocalGuess] = useState(gameState.currentGuess);

    // Sync guess when it arrives from server
    useEffect(() => {
        setLocalGuess(gameState.currentGuess);
    }, [gameState.currentGuess]);

    // Also listen for rapid 'guess_updated' events (not full room state)
    useEffect(() => {
        const onGuessUpdated = (angle) => {
            setLocalGuess(angle);
        };
        socket.on('guess_updated', onGuessUpdated);
        return () => {
            socket.off('guess_updated', onGuessUpdated);
        };
    }, []);

    const handleGuessChange = (angle) => {
        setLocalGuess(angle);
        socket.emit('update_guess', { roomId: room.id, angle });
    };

    if (gameState.phase === 'gameOver') {
        return <GameOverPhase room={room} isHost={isHost} />;
    }

    return (
        <div className="w-full flex justify-center items-center flex-col animate-in fade-in duration-500 min-h-full">

            <HUD room={room} />

            <div className="w-full max-w-4xl relative mt-4">

                {/* Floating Clue Display (if it exists) */}
                {gameState.clue && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 -translate-y-full w-full max-w-lg z-20 transition-all">
                        <div className="bg-slate-800 text-white font-bold text-4xl italic p-6 py-8 rounded-3xl border-2 border-brand-500/50 shadow-2xl shadow-brand-500/10 text-center relative pointer-events-none tracking-wide text-balance">
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 bg-slate-800 border-b-2 border-r-2 border-brand-500/50 rotate-45" />
                            "{gameState.clue}"
                        </div>
                    </div>
                )}

                {/* Central Dial & Context Cards Area */}
                <div className="flex justify-between items-end gap-6 w-full px-4 relative z-10 my-20">
                    <ContextCard concept={gameState.spectrum.left} align="left" />

                    <div className="flex-grow max-w-[550px]">
                        <Dial
                            currentGuess={localGuess}
                            targetAngle={gameState.targetAngle}
                            phase={gameState.phase}
                            isClueGiver={isClueGiver}
                            onGuessChange={handleGuessChange}
                        />
                    </div>

                    <ContextCard concept={gameState.spectrum.right} align="right" />
                </div>

                {/* Dynamic Action Area rendering Phase components */}
                {gameState.phase === 'clue' && (
                    <CluePhase
                        room={room}
                        isClueGiver={isClueGiver}
                        clueGiverName={clueGiverName}
                    />
                )}

                {gameState.phase === 'guess' && (
                    <GuessPhase
                        room={room}
                        isClueGiver={isClueGiver}
                        localGuess={localGuess}
                    />
                )}

                {gameState.phase === 'reveal' && (
                    <RevealPhase
                        room={room}
                        isHost={isHost}
                    />
                )}

            </div>
        </div>
    );
}
