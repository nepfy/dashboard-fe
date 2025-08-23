"use client";

import type React from "react";

import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  left: number;
  top: number;
  rotation: number;
  color: string;
  shape: "square" | "diamond" | "rectangle";
  size: number;
  animationDelay: number;
  animationDuration: number;
  horizontalVelocity: number;
  rotationSpeed: number;
}

const colors = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
];

const shapes = ["square", "diamond", "rectangle"] as const;

export function ConfettiAnimation() {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    const pieces: ConfettiPiece[] = [];

    for (let i = 0; i < 30; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100, // Random horizontal position
        top: -10, // Start above the viewport
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        size: Math.random() * 15 + 8,
        animationDelay: Math.random() * 2, // Stagger the start times
        animationDuration: Math.random() * 2 + 3, // 3-5 seconds fall time
        horizontalVelocity: (Math.random() - 0.5) * 50, // Random horizontal drift
        rotationSpeed: (Math.random() - 0.5) * 720, // Random rotation speed
      });
    }

    setConfetti(pieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className={`absolute animate-confetti-fall opacity-80`}
          style={
            {
              left: `${piece.left}%`,
              top: `${piece.top}%`,
              animationDelay: `${piece.animationDelay}s`,
              animationDuration: `${piece.animationDuration}s`,
              "--horizontal-velocity": `${piece.horizontalVelocity}px`,
              "--rotation-speed": `${piece.rotationSpeed}deg`,
              "--initial-rotation": `${piece.rotation}deg`,
            } as React.CSSProperties
          }
        >
          <div
            className={`${
              piece.shape === "diamond"
                ? "rotate-45"
                : piece.shape === "rectangle"
                ? "w-6 h-3"
                : "aspect-square"
            }`}
            style={{
              backgroundColor: piece.color,
              width: piece.shape === "rectangle" ? "24px" : `${piece.size}px`,
              height: piece.shape === "rectangle" ? "12px" : `${piece.size}px`,
            }}
          />
        </div>
      ))}
    </div>
  );
}
