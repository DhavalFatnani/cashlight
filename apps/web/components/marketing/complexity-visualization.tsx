"use client";

import { useEffect, useRef, useState } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
  pulseSpeed: number;
  label: string;
  removed: boolean;
  removalTime?: number;
}

interface Connection {
  from: number;
  to: number;
  opacity: number;
}

const NODE_LABELS = [
  "Bank Account",
  "Investment",
  "Credit Card",
  "EMI",
  "Insurance",
  "SIP",
  "Freelance",
  "Bonus",
  "Family",
  "Expense",
  "Savings",
  "Loan",
  "Tax",
  "Gold",
  "Crypto",
];

export function ComplexityVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const hoveredNodeRef = useRef<number | null>(null);
  const animationRef = useRef<number>();
  const [ambientOnly, setAmbientOnly] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const update = () => setAmbientOnly(coarse.matches);
    update();
    coarse.addEventListener("change", update);
    return () => coarse.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const interactive = !ambientOnly;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    const initNodes = () => {
      const isMobile = window.innerWidth < 768;
      const nodeCount = isMobile ? 40 : 80;
      const nodes: Node[] = [];
      const connections: Connection[] = [];

      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: 3 + Math.random() * 4,
          pulsePhase: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.03,
          label: NODE_LABELS[Math.floor(Math.random() * NODE_LABELS.length)] || "Account",
          removed: false,
        });
      }

      // Create connections between nearby nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeA = nodes[i];
          const nodeB = nodes[j];
          if (!nodeA || !nodeB) continue;

          const dx = nodeA.x - nodeB.x;
          const dy = nodeA.y - nodeB.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 200 && Math.random() > 0.7) {
            connections.push({
              from: i,
              to: j,
              opacity: 0.1 + Math.random() * 0.2,
            });
          }
        }
      }

      nodesRef.current = nodes;
      connectionsRef.current = connections;
    };

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const nodes = nodesRef.current;
      const connections = connectionsRef.current;

      // Update and draw connections
      connections.forEach((conn) => {
        const fromNode = nodes[conn.from];
        const toNode = nodes[conn.to];

        if (!fromNode || !toNode) return;

        const dx = fromNode.x - toNode.x;
        const dy = fromNode.y - toNode.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 250) {
          const opacity = conn.opacity * (1 - distance / 250);
          ctx.beginPath();
          ctx.moveTo(fromNode.x, fromNode.y);
          ctx.lineTo(toNode.x, toNode.y);
          ctx.strokeStyle = `rgba(232, 170, 80, ${opacity * 0.3})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Update and draw nodes
      nodes.forEach((node, index) => {
        // Handle removed nodes - show "Payment made" feedback
        if (node.removed && node.removalTime) {
          const timeSinceRemoval = timestamp - node.removalTime;
          if (timeSinceRemoval < 2000) {
            // Show "Payment made" text for 2 seconds
            const parallaxX = (mouseRef.current.x - canvas.width / 2) * 0.02;
            const parallaxY = (mouseRef.current.y - canvas.height / 2) * 0.02;
            const drawX = node.x + parallaxX;
            const drawY = node.y + parallaxY;

            const opacity = 1 - timeSinceRemoval / 2000;
            ctx.font = "12px JetBrains Mono, monospace";
            ctx.fillStyle = `rgba(232, 170, 80, ${opacity})`;
            ctx.fillText("✓ Payment made", drawX + 15, drawY);
          }
          return;
        }

        // Update position
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Update pulse
        node.pulsePhase += node.pulseSpeed;
        const pulse = Math.sin(node.pulsePhase) * 0.3 + 1;

        // Mouse parallax
        const parallaxX = (mouseRef.current.x - canvas.width / 2) * 0.02;
        const parallaxY = (mouseRef.current.y - canvas.height / 2) * 0.02;

        const drawX = node.x + parallaxX;
        const drawY = node.y + parallaxY;

        // Check hover
        const dx = mouseRef.current.x - drawX;
        const dy = mouseRef.current.y - drawY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const isHovered = distance < 30;

        if (isHovered) {
          hoveredNodeRef.current = index;
        }

        // Draw node
        const isDimmed = hoveredNodeRef.current !== null && hoveredNodeRef.current !== index;
        const baseOpacity = isDimmed ? 0.2 : 0.4;

        // Glow
        const gradient = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, node.radius * 3 * pulse);
        gradient.addColorStop(0, `rgba(232, 170, 80, ${baseOpacity * 0.5})`);
        gradient.addColorStop(1, "rgba(232, 170, 80, 0)");
        ctx.beginPath();
        ctx.arc(drawX, drawY, node.radius * 3 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Node
        ctx.beginPath();
        ctx.arc(drawX, drawY, node.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 170, 80, ${isHovered ? 0.8 : baseOpacity})`;
        ctx.fill();

        // Label on hover
        if (isHovered) {
          ctx.font = "12px JetBrains Mono, monospace";
          ctx.fillStyle = "rgba(243, 235, 218, 0.9)";
          ctx.fillText(node.label, drawX + 15, drawY - 5);
        }
      });

      // Reset hover if no node is hovered
      if (hoveredNodeRef.current !== null) {
        const hoveredNode = nodes[hoveredNodeRef.current];
        if (hoveredNode) {
          const dx = mouseRef.current.x - (hoveredNode.x + (mouseRef.current.x - canvas.width / 2) * 0.02);
          const dy = mouseRef.current.y - (hoveredNode.y + (mouseRef.current.y - canvas.height / 2) * 0.02);
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance >= 30) {
            hoveredNodeRef.current = null;
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleClick = (e: MouseEvent) => {
      if (!interactive) return;
      const nodes = nodesRef.current;
      const parallaxX = (e.clientX - canvas.width / 2) * 0.02;
      const parallaxY = (e.clientY - canvas.height / 2) * 0.02;

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (!node) continue;

        const drawX = node.x + parallaxX;
        const drawY = node.y + parallaxY;

        const dx = e.clientX - drawX;
        const dy = e.clientY - drawY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 30 && !node.removed) {
          // Mark node as removed
          node.removed = true;
          node.removalTime = performance.now();
          break;
        }
      }
    };

    window.addEventListener("resize", resize);
    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("click", handleClick);
    }

    resize();
    animate(0);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [ambientOnly]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100dvh",
        opacity: 0.35,
        pointerEvents: ambientOnly ? "none" : "auto",
        zIndex: 0,
      }}
    />
  );
}
