import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Dial({
    currentGuess,
    targetAngle,
    phase,
    isClueGiver,
    onGuessChange
}) {
    const dialRef = useRef(null);

    // Math: Mouse coordinate to Angle (0 to 180 deg)
    const calculateAngle = (e) => {
        if (!dialRef.current) return currentGuess;
        const rect = dialRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        // Bottom center of the semi-circle
        const centerY = rect.bottom;

        // We only care about coordinates relative to center
        const dx = e.clientX - centerX;
        const dy = e.clientY - centerY;

        // Calculate angle in radians. Math.atan2(y, x)
        // Note: y axis is inverted in DOM
        const rawAngle = Math.atan2(-dy, dx);
        let degrees = rawAngle * (180 / Math.PI);

        // Clamp angle between 0 and 180 (left is 180, right is 0)
        // In our UI, let's map left to 0 and right to 180 to match standard visual progression.
        // atan2 gives: right = 0, up = 90, left = 180
        // So 180 - degrees flips it so left is 0, right is 180.
        degrees = 180 - degrees;

        if (degrees < 0) degrees = 0;
        if (degrees > 180) degrees = 180;

        return degrees;
    };

    const handlePointerMove = (e) => {
        // Only allow guessers to move dial during guess phase
        if (phase !== 'guess' || isClueGiver) return;
        if (e.buttons === 1) { // Left mouse button pressed
            const angle = calculateAngle(e);
            onGuessChange(angle);
        }
    };

    const handlePointerDown = (e) => {
        if (phase !== 'guess' || isClueGiver) return;
        const angle = calculateAngle(e);
        onGuessChange(angle);
        e.target.setPointerCapture(e.pointerId);
    };

    const showTarget = isClueGiver || phase === 'reveal' || phase === 'gameOver';

    // The slice consists of 5 bands mapped around targetAngle
    // Each band is colored for different score values
    // Center: 4deg wide (±2) = 5 pts
    // Next: 8deg wide each side (±2 to ±10 ) = wait, rules say ±6, ±10, ±15.
    // Band 1 (5pts): target ± 2 (4 deg)
    // Band 2 (4pts): target ± 6 (12 deg)
    // Band 3 (3pts): target ± 10 (20 deg)
    // Band 4 (2pts): target ± 15 (30 deg)

    // Helpers to draw the SVG arcs
    // Radius of the dial
    const R = 200;

    const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
        // 0 deg is left now, 180 goes to right over the top
        const angleInRadians = Math.PI - (angleInDegrees * Math.PI / 180.0);
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY - (radius * Math.sin(angleInRadians))
        };
    };

    const describeArc = (x, y, radius, startAngle, endAngle) => {
        const start = polarToCartesian(x, y, radius, startAngle);
        const end = polarToCartesian(x, y, radius, endAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y,
            "L", x, y,
            "Z"
        ].join(" ");
    };

    // Convert angles to be clamped between 0 and 180 visually
    const getBandPath = (offset) => {
        let start = Math.max(0, targetAngle - offset);
        let end = Math.min(180, targetAngle + offset);
        return describeArc(250, 250, R, start, end);
    };

    return (
        <div className="relative w-full max-w-[500px] aspect-[2/1] mx-auto select-none touch-none mt-8 drop-shadow-2xl flex items-end justify-center">

            {/* Container for SVG interactions */}
            <div
                ref={dialRef}
                className="w-full h-full relative"
                style={{ cursor: (phase === 'guess' && !isClueGiver) ? 'grab' : 'default' }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
            >
                <svg
                    viewBox="0 0 500 250"
                    className="w-full h-full overflow-visible"
                >
                    <defs>
                        {/* Soft gradient for the background semi-circle */}
                        <linearGradient id="gradBg" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#1e293b" />
                            <stop offset="50%" stopColor="#334155" />
                            <stop offset="100%" stopColor="#1e293b" />
                        </linearGradient>

                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    {/* Base dial background */}
                    <path d="M 50 250 A 200 200 0 0 1 450 250 L 50 250 Z" fill="url(#gradBg)" stroke="#475569" strokeWidth="4" />

                    {/* Target Zones */}
                    {showTarget && (
                        <g>
                            {/* Outer band (2 pts) */}
                            <path d={getBandPath(15)} fill="#fcd34d" opacity="0.6" />
                            {/* Mid band (3 pts) */}
                            <path d={getBandPath(10)} fill="#f59e0b" opacity="0.8" />
                            {/* Close band (4 pts) */}
                            <path d={getBandPath(6)} fill="#f97316" />
                            {/* Bullseye (5 pts) */}
                            <path d={getBandPath(2)} fill="#ef4444" filter="url(#glow)" />
                        </g>
                    )}

                    {/* Inner hole covering the apex to make it look like a physical dial mechanism */}
                    <path d="M 210 250 A 40 40 0 0 1 290 250 Z" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                </svg>

                {/* The Needle Pointer */}
                {/* We absolutely position a div origin bottom center, and rotate it */}
                <motion.div
                    className="absolute bottom-0 left-1/2 w-2 h-[85%] origin-bottom bg-red-500 rounded-t-full shadow-[0_0_10px_rgba(2ef,68,68,0.8)] z-10 -ml-1"
                    animate={{ rotate: currentGuess - 90 }} // Map 0-180 to -90 to 90 degrees CSS rotation
                    transition={{ type: "spring", stiffness: 300, damping: 25, mass: 0.5 }}
                    style={{ transformOrigin: 'bottom center' }}
                >
                    {/* Inner line detail for premium look */}
                    <div className="w-1 h-3/4 bg-white/30 mx-auto mt-2 rounded-full" />
                </motion.div>

                {/* Center Pivot Point */}
                <div className="absolute bottom-[-15px] left-1/2 -ml-[15px] w-[30px] h-[30px] bg-slate-800 border-4 border-slate-600 rounded-full shadow-xl z-20 flex justify-center items-center">
                    <div className="w-2 h-2 bg-slate-400 rounded-full" />
                </div>
            </div>
        </div>
    );
}
