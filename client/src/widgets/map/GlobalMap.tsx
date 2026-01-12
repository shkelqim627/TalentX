'use client';

import React, { useEffect, useRef } from 'react';
import createGlobe from 'cobe';
import { useSpring } from 'react-spring';
import { Talent, Team, Agency } from '@/shared/types';

interface GlobalMapProps {
    talents: Talent[];
    teams: Team[];
    agencies: Agency[];
    className?: string;
}

export default function GlobalMap({ talents, teams, agencies, className = "" }: GlobalMapProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointerInteracting = useRef<number | null>(null);
    const pointerInteractionMovement = useRef(0);
    const [{ r }, api] = useSpring(() => ({
        r: 0,
        config: {
            mass: 1,
            tension: 280,
            friction: 40,
            precision: 0.001,
        },
    }));

    useEffect(() => {
        let phi = 0;
        let width = 0;

        const onResize = () => {
            if (canvasRef.current && (width !== canvasRef.current.offsetWidth)) {
                width = canvasRef.current.offsetWidth;
            }
        };
        window.addEventListener('resize', onResize);
        onResize();

        if (!canvasRef.current) return;

        // Define TalentX HQ (e.g., San Francisco) - The "Master Dot"
        const talentXHQ = { location: [37.7749, -122.4194] as [number, number], size: 0.2, color: [1, 0.2, 0.2] as [number, number, number] }; // Bigger Red Dot

        // Prepare markers
        const otherMarkers = [
            ...talents.filter(t => t.coordinates).map(t => ({ location: [t.coordinates!.lat, t.coordinates!.lng] as [number, number], size: 0.05, color: [0.2, 0.5, 1] as [number, number, number] })),
            ...teams.filter(t => t.coordinates).map(t => ({ location: [t.coordinates!.lat, t.coordinates!.lng] as [number, number], size: 0.08, color: [0.6, 0.2, 1] as [number, number, number] })),
            ...agencies.filter(t => t.coordinates).map(t => ({ location: [t.coordinates!.lat, t.coordinates!.lng] as [number, number], size: 0.08, color: [0.2, 0.8, 0.4] as [number, number, number] }))
        ];

        // Define connections: From HQ to all others
        const connections: { start: [number, number], end: [number, number], progress: number, speed: number }[] = [];

        // Create connections to a subset of markers to avoid clutter
        const maxConnections = 40;
        const targetMarkers = otherMarkers.sort(() => 0.5 - Math.random()).slice(0, maxConnections);

        targetMarkers.forEach(target => {
            connections.push({
                start: talentXHQ.location,
                end: target.location,
                progress: Math.random(),
                speed: 0.003 + Math.random() * 0.005
            });
        });

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: width * 2,
            height: width * 2,
            phi: 0,
            theta: 0.3,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.1, 0.1, 0.2],
            markerColor: [0.1, 0.8, 1],
            glowColor: [0.2, 0.2, 0.4],
            markers: [],
            onRender: (state) => {
                if (!pointerInteracting.current) {
                    phi += 0.003;
                }
                state.phi = phi + r.get();
                state.width = width * 2;
                state.height = width * 2;

                // Animate markers
                const currentMarkers = otherMarkers.map(m => ({
                    ...m,
                    size: m.size * (0.8 + 0.4 * Math.sin(Date.now() / 200 + m.location[0] * 10))
                }));

                // Add Master Dot with distinct "heartbeat" pulse
                currentMarkers.push({
                    ...talentXHQ,
                    size: talentXHQ.size * (1 + 0.3 * Math.sin(Date.now() / 500))
                });

                connections.forEach(conn => {
                    conn.progress += conn.speed;
                    if (conn.progress > 1) conn.progress = 0;

                    const lat = conn.start[0] + (conn.end[0] - conn.start[0]) * conn.progress;
                    const lng = conn.start[1] + (conn.end[1] - conn.start[1]) * conn.progress;

                    // Shooting star head
                    currentMarkers.push({
                        location: [lat, lng],
                        size: 0.03,
                        color: [1, 1, 1]
                    });

                    // Trail
                    for (let i = 1; i <= 3; i++) {
                        const trailProgress = conn.progress - (i * 0.02);
                        if (trailProgress > 0) {
                            const tLat = conn.start[0] + (conn.end[0] - conn.start[0]) * trailProgress;
                            const tLng = conn.start[1] + (conn.end[1] - conn.start[1]) * trailProgress;
                            currentMarkers.push({
                                location: [tLat, tLng],
                                size: 0.03 * (1 - i / 4),
                                color: [1, 1, 1]
                            });
                        }
                    }
                });

                state.markers = currentMarkers.map(m => ({ location: m.location, size: m.size, color: m.color }));
            },
        });

        return () => {
            globe.destroy();
            window.removeEventListener('resize', onResize);
        };
    }, [talents, teams, agencies, r]);

    return (
        <div className={`relative flex items-center justify-center bg-[#050510] overflow-hidden rounded-xl border border-white/10 shadow-2xl ${className || 'w-full h-[500px]'}`}>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050510]/20 to-[#050510] z-10 pointer-events-none" />

            <canvas
                ref={canvasRef}
                style={{ width: '100%', height: '100%', maxWidth: '500px', aspectRatio: '1', position: 'relative', zIndex: 1 }}
                onPointerDown={(e) => {
                    pointerInteracting.current = e.clientX - pointerInteractionMovement.current;
                    canvasRef.current!.style.cursor = 'grabbing';
                }}
                onPointerUp={() => {
                    pointerInteracting.current = null;
                    canvasRef.current!.style.cursor = 'grab';
                }}
                onPointerOut={() => {
                    pointerInteracting.current = null;
                    canvasRef.current!.style.cursor = 'grab';
                }}
                onMouseMove={(e) => {
                    if (pointerInteracting.current !== null) {
                        const delta = e.clientX - pointerInteracting.current;
                        pointerInteractionMovement.current = delta;
                        api.start({
                            r: delta / 200,
                        });
                    }
                }}
                onTouchMove={(e) => {
                    if (pointerInteracting.current !== null && e.touches[0]) {
                        const delta = e.touches[0].clientX - pointerInteracting.current;
                        pointerInteractionMovement.current = delta;
                        api.start({
                            r: delta / 100,
                        });
                    }
                }}
            />

            {/* Overlay Text */}
            <div className="absolute bottom-8 left-8 z-20 pointer-events-none text-left">
                <h3 className="text-2xl font-bold text-white">TalentX Network</h3>
                <p className="text-gray-400">Real-time Connections</p>
            </div>

            {/* Legend */}
            <div className="absolute top-8 right-8 z-20 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 text-left">
                <div className="flex items-center gap-3 mb-2">
                    <span className="w-3 h-3 rounded-full bg-[#ff3333] animate-pulse shadow-[0_0_10px_#ff3333]"></span>
                    <span className="text-sm font-bold text-white">TalentX HQ</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[#3380ff]"></span>
                    <span className="text-xs text-gray-300">Talent</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[#9933ff]"></span>
                    <span className="text-xs text-gray-300">Team</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-[#33cc66]"></span>
                    <span className="text-xs text-gray-300">Agency</span>
                </div>
            </div>
        </div>
    );
}
