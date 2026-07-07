import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, RefreshCw, Radio } from "lucide-react";

interface Node {
  id: string;
  name: string;
  type: "Factory" | "Warehouse" | "Retail" | "Port";
  x: number;
  y: number;
  color: string;
}

interface Carrier {
  id: string;
  from: string;
  to: string;
  type: "Truck" | "Ship" | "Plane";
  progress: number;
  speed: number;
}

export const WorldMap: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeCarrier, setActiveCarrier] = useState<string | null>(null);

  const nodes: Node[] = [
    { id: "TAI", name: "Apex Semiconductor (Taiwan)", type: "Factory", x: 740, y: 310, color: "#8B7FF5" },
    { id: "HQ", name: "Warehouse East (HQ)", type: "Warehouse", x: 220, y: 190, color: "#F0A93A" },
    { id: "WW", name: "Warehouse West (Logistics)", type: "Warehouse", x: 140, y: 220, color: "#3B82F6" },
    { id: "EUR", name: "Munich Retail Outlet (Germany)", type: "Retail", x: 490, y: 150, color: "#10B981" },
    { id: "PORT-A", name: "Port of Long Beach", type: "Port", x: 120, y: 240, color: "#A855F7" },
  ];

  const [carriers, setCarriers] = useState<Carrier[]>([
    { id: "C-1", from: "TAI", to: "PORT-A", type: "Ship", progress: 0.15, speed: 0.002 },
    { id: "C-2", from: "HQ", to: "EUR", type: "Plane", progress: 0.45, speed: 0.015 },
    { id: "C-3", from: "PORT-A", to: "WW", type: "Truck", progress: 0.70, speed: 0.008 },
    { id: "C-4", from: "HQ", to: "WW", type: "Truck", progress: 0.10, speed: 0.005 },
  ]);

  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = 360;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background ocean grid lines
      ctx.strokeStyle = "#1A1E29";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let j = 0; j < canvas.height; j += 40) {
        ctx.beginPath();
        ctx.moveTo(0, j);
        ctx.lineTo(canvas.width, j);
        ctx.stroke();
      }

      // Draw global supply curves (arcs between nodes)
      nodes.forEach((node) => {
        nodes.forEach((target) => {
          if (node.id !== target.id) {
            // Draw curved dashed supply line
            ctx.beginPath();
            ctx.strokeStyle = "rgba(139, 127, 245, 0.12)";
            ctx.setLineDash([5, 8]);
            ctx.lineWidth = 1.5;
            ctx.moveTo(node.x, node.y);
            // Arc control point
            const midX = (node.x + target.x) / 2;
            const midY = (node.y + target.y) / 2 - 40;
            ctx.quadraticCurveTo(midX, midY, target.x, target.y);
            ctx.stroke();
          }
        });
      });
      ctx.setLineDash([]); // Reset dashed

      // Draw node locations
      nodes.forEach((node) => {
        // Soft pulsing glow
        const pulse = Math.sin(Date.now() / 400) * 4 + 6;
        ctx.beginPath();
        ctx.fillStyle = node.color + "22";
        ctx.arc(node.x, node.y, 10 + pulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = node.color;
        ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.strokeStyle = "#EDEFF4";
        ctx.lineWidth = 1.5;
        ctx.arc(node.x, node.y, 6, 0, Math.PI * 2);
        ctx.stroke();

        // Label
        ctx.font = "10px Inter";
        ctx.fillStyle = "#8B92A5";
        ctx.fillText(node.name, node.x + 10, node.y + 3);
      });

      // Update and Draw active carriers
      carriers.forEach((carrier) => {
        const fromNode = nodes.find((n) => n.id === carrier.from);
        const toNode = nodes.find((n) => n.id === carrier.to);
        if (fromNode && toNode) {
          // Calculate curved position
          const p = carrier.progress;
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2 - 40;

          // Bezier interpolation for the arc
          const x = (1 - p) * (1 - p) * fromNode.x + 2 * (1 - p) * p * midX + p * p * toNode.x;
          const y = (1 - p) * (1 - p) * fromNode.y + 2 * (1 - p) * p * midY + p * p * toNode.y;

          // Draw active carrier dot
          ctx.beginPath();
          ctx.fillStyle = carrier.type === "Plane" ? "#EF4444" : carrier.type === "Ship" ? "#3B82F6" : "#F59E0B";
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.beginPath();
          ctx.strokeStyle = "#EDEFF4";
          ctx.lineWidth = 1;
          ctx.arc(x, y, 5, 0, Math.PI * 2);
          ctx.stroke();

          // Type abbreviation text
          ctx.font = "8px 'JetBrains Mono'";
          ctx.fillStyle = "#EDEFF4";
          ctx.fillText(carrier.type[0], x - 2.5, y + 3);

          // Update progress if playing
          if (isPlaying) {
            carrier.progress += carrier.speed;
            if (carrier.progress >= 1) {
              carrier.progress = 0; // wrap around
            }
          }
        }
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [isPlaying, carriers]);

  return (
    <div className="bg-[#1A1E29] border border-[#2A3040] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3 border-b border-[#2A3040] pb-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <h3 className="text-sm font-display font-medium text-[#EDEFF4] flex items-center gap-2">
            GLOBAL SUPPLY CHAIN DIGITAL TWIN MAP
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 px-2.5 rounded-lg bg-[#10131A] border border-[#2A3040] text-xs font-mono text-[#8B92A5] hover:text-[#EDEFF4] transition-colors flex items-center gap-1.5"
            id="btn-play-map"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? "HALT ANIMATION" : "RESUME MAP"}
          </button>
          <button
            onClick={() => {
              setCarriers((prev) => prev.map((c) => ({ ...c, progress: Math.random() })));
            }}
            className="p-1 px-2.5 rounded-lg bg-[#10131A] border border-[#2A3040] text-xs font-mono text-[#8B92A5] hover:text-[#EDEFF4] transition-colors flex items-center gap-1.5"
            id="btn-refresh-map"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            RESET CARRIERS
          </button>
        </div>
      </div>

      <div className="relative w-full overflow-hidden bg-[#10131A] rounded-xl border border-[#2A3040]">
        <canvas ref={canvasRef} className="block w-full" />
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 bg-[#1A1E29]/90 backdrop-blur-md p-2 rounded-lg border border-[#2A3040]/60 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#8B7FF5] border border-white"></div>
            <span>Taiwan Factory</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#F0A93A] border border-white"></div>
            <span>HQ Warehouse</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444] border border-white"></div>
            <span>Plane Transit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] border border-white"></div>
            <span>Sea Cargo (Oceanic)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] border border-white"></div>
            <span>Land Freight (Truck)</span>
          </div>
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-[#1A1E29]/90 backdrop-blur-md p-1.5 px-2.5 rounded-lg border border-[#2A3040]/60 text-[9px] font-mono text-emerald-400 animate-pulse">
          <Radio className="w-3 h-3" />
          LIVE RADAR ACTIVE
        </div>
      </div>
    </div>
  );
};
export default WorldMap;
