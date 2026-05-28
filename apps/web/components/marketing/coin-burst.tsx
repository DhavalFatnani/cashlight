"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const COIN_SYMBOLS = ["₹", "$", "€", "£", "¥", "₿"];
const PARTICLE_COUNT = 12;

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  symbol: string;
  scale: number;
}

export function CoinBurst({ x, y }: { x: number; y: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const particles: Particle[] = [];
    const elements: Map<number, HTMLDivElement> = new Map();

    // Create particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (Math.PI * 2 * i) / PARTICLE_COUNT;
      const velocity = 100 + Math.random() * 100;
      const particle: Particle = {
        id: i,
        x: 0,
        y: 0,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 50, // Initial upward bias
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 720,
        symbol: COIN_SYMBOLS[Math.floor(Math.random() * COIN_SYMBOLS.length)] || "₹",
        scale: 0.5 + Math.random() * 0.5,
      };
      particles.push(particle);

      const el = document.createElement("div");
      el.className = "coin-particle";
      el.textContent = particle.symbol;
      el.style.left = "0";
      el.style.top = "0";
      el.style.transform = `translate(${particle.x}px, ${particle.y}px) rotate(${particle.rotation}deg) scale(${particle.scale})`;
      containerRef.current.appendChild(el);
      elements.set(i, el);
    }

    let startTime: number | null = null;
    const duration = 1200;

    function animate(timestamp: number) {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      particles.forEach((particle) => {
        const el = elements.get(particle.id);
        if (!el) return;

        // Physics
        const gravity = 400;
        const dt = 0.016; // Approximate 60fps

        particle.vy += gravity * dt;
        particle.x += particle.vx * dt;
        particle.y += particle.vy * dt;
        particle.rotation += particle.rotationSpeed * dt;

        // Fade out
        const opacity = 1 - progress;
        el.style.opacity = String(opacity);
        el.style.transform = `translate(${particle.x}px, ${particle.y}px) rotate(${particle.rotation}deg) scale(${particle.scale})`;
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Cleanup
        elements.forEach((el) => el.remove());
      }
    }

    requestAnimationFrame(animate);

    return () => {
      elements.forEach((el) => el.remove());
    };
  }, [x, y]);

  return createPortal(
    <div
      ref={containerRef}
      className="coin-burst-container"
      style={{
        position: "fixed",
        left: x,
        top: y,
        pointerEvents: "none",
        zIndex: 9999,
        transform: "translate(-50%, -50%)",
      }}
    />,
    document.body
  );
}
