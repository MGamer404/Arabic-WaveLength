const fs = require('fs');

// Load cards globally
const cards = JSON.parse(fs.readFileSync('./cards.json', 'utf8'));

function getRandomCard() {
    return cards[Math.floor(Math.random() * cards.length)];
}

function getRandomAngle() {
    return Math.floor(Math.random() * 150) + 15;
}

function calculateScore(target, guess) {
    const diff = Math.abs(target - guess);
    if (diff <= 2) return 5;
    if (diff <= 6) return 4;
    if (diff <= 10) return 3;
    if (diff <= 15) return 2;
    return 0;
}

class GameRoom {
    constructor(id, hostId) {
        this.id = id;
        this.hostId = hostId;
        this.players = [];
        this.settings = { totalRounds: 4 };
        this.gameState = {
            phase: 'lobby',
            round: 1,
            turn: 1,
            score: 0,
            targetScore: 4 * 2.5,
            clueGiverIndex: 0,
            spectrum: { left: '', right: '' },
            targetAngle: 90,
            clue: '',
            currentGuess: 90,
            lastScoreEarned: 0
        };
    }

    addPlayer(id, name) {
        if (!this.players.find(p => p.id === id)) {
            this.players.push({ id, name });
        }
    }

    removePlayer(id) {
        const idx = this.players.findIndex(p => p.id === id);
        if (idx !== -1) {
            this.players.splice(idx, 1);
            // Reassign host if necessary
            if (this.hostId === id && this.players.length > 0) {
                this.hostId = this.players[0].id;
            }
        }
    }

    updateSettings(settings) {
        if (this.gameState.phase === 'lobby') {
            this.settings = settings;
            this.gameState.targetScore = Math.ceil(this.settings.totalRounds * Math.max(1, this.players.length) * 2.5);
        }
    }

    startGame() {
        if (this.gameState.phase === 'lobby') {
            this.gameState.phase = 'clue';
            this.gameState.round = 1;
            this.gameState.turn = 1;
            this.gameState.score = 0;
            this.gameState.targetScore = Math.ceil(this.settings.totalRounds * Math.max(1, this.players.length) * 2.5);
            this.gameState.clueGiverIndex = Math.floor(Math.random() * this.players.length);
            this.gameState.spectrum = getRandomCard();
            this.gameState.targetAngle = getRandomAngle();
            this.gameState.clue = '';
            this.gameState.currentGuess = 90;
        }
    }

    submitClue(playerId, clue) {
        if (this.gameState.phase === 'clue') {
            const currentClueGiver = this.players[this.gameState.clueGiverIndex];
            if (currentClueGiver && currentClueGiver.id === playerId) {
                this.gameState.clue = clue;
                this.gameState.phase = 'guess';
            }
        }
    }

    updateGuess(angle) {
        if (this.gameState.phase === 'guess') {
            this.gameState.currentGuess = angle;
        }
    }

    lockGuess(finalAngle) {
        if (this.gameState.phase === 'guess') {
            this.gameState.currentGuess = finalAngle;
            const points = calculateScore(this.gameState.targetAngle, this.gameState.currentGuess);
            this.gameState.score += points;
            this.gameState.lastScoreEarned = points;
            this.gameState.phase = 'reveal';
        }
    }

    nextRound() {
        if (this.gameState.phase === 'reveal') {
            const totalTurns = this.settings.totalRounds * Math.max(1, this.players.length);
            if (this.gameState.turn >= totalTurns) {
                this.gameState.phase = 'gameOver';
            } else {
                this.gameState.turn += 1;
                if ((this.gameState.turn - 1) % this.players.length === 0) {
                    this.gameState.round += 1;
                }
                this.gameState.phase = 'clue';
                this.gameState.clueGiverIndex = (this.gameState.clueGiverIndex + 1) % this.players.length;
                this.gameState.spectrum = getRandomCard();
                this.gameState.targetAngle = getRandomAngle();
                this.gameState.clue = '';
                this.gameState.currentGuess = 90;
            }
        }
    }

    playAgain() {
        if (this.gameState.phase === 'gameOver') {
            this.gameState.phase = 'lobby';
        }
    }

    // To easily emit the room state
    toJSON() {
        return {
            id: this.id,
            hostId: this.hostId,
            players: this.players,
            settings: this.settings,
            gameState: this.gameState
        };
    }
}

module.exports = GameRoom;
