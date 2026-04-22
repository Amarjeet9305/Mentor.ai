"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const flowers = ["🌸", "🌼", "🌻", "🌺", "🌷", "🌹", "🍀", "✨"];

export default function PaymentSuccessCelebration() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isCelebrating, setIsCelebrating] = useState(false);
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        if (searchParams.get("payment") === "success") {
            setIsCelebrating(true);
            toast.success("Payment Received! Welcome to the premium mentor circle! 🎉", {
                duration: 6000,
                position: "top-center",
                style: {
                    background: "#4f46e5",
                    color: "#fff",
                    fontWeight: "bold",
                    borderRadius: "16px",
                    padding: "16px 24px",
                }
            });

            // Create initial burst of flower particles
            const newParticles = Array.from({ length: 40 }).map((_, i) => ({
                id: i,
                char: flowers[Math.floor(Math.random() * flowers.length)],
                x: Math.random() * 100, // percentage from left
                y: Math.random() * 100, // percentage from top
                scale: 0.5 + Math.random(),
                rotation: Math.random() * 360,
                delay: Math.random() * 0.5,
            }));
            setParticles(newParticles);

            // Clean up the URL after a few seconds without refreshing the page
            const timeout = setTimeout(() => {
                const params = new URLSearchParams(searchParams.toString());
                params.delete("payment");
                const newPath = window.location.pathname + (params.toString() ? `?${params.toString()}` : "");
                router.replace(newPath, { scroll: false });
                setIsCelebrating(false);
            }, 6000);

            return () => clearTimeout(timeout);
        }
    }, [searchParams, router]);

    return (
        <AnimatePresence>
            {isCelebrating && (
                <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
                    {/* Background Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-indigo-500/5 backdrop-blur-[2px]"
                    />

                    {/* Flower Burst */}
                    {particles.map((p) => (
                        <motion.div
                            key={p.id}
                            initial={{ 
                                opacity: 0, 
                                x: "50vw", 
                                y: "100vh", 
                                scale: 0,
                                rotate: 0 
                            }}
                            animate={{ 
                                opacity: [0, 1, 1, 0],
                                x: [`${p.x}vw`],
                                y: [`${p.y}vh`],
                                scale: [0, p.scale, p.scale, 0],
                                rotate: p.rotation + 720
                            }}
                            transition={{ 
                                duration: 4, 
                                delay: p.delay,
                                ease: "easeOut"
                            }}
                            className="absolute text-4xl select-none"
                        >
                            {p.char}
                        </motion.div>
                    ))}

                    {/* Celebration Message */}
                    <motion.div
                        initial={{ scale: 0, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0, opacity: 0, y: -20 }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
                    >
                        <div className="bg-white/80 backdrop-blur-xl px-12 py-8 rounded-[40px] shadow-2xl border border-indigo-100 flex flex-col items-center gap-4">
                            <motion.div
                                animate={{ rotate: [0, 10, -10, 10, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="text-7xl"
                            >
                                🎊
                            </motion.div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                Success Party!
                            </h2>
                            <p className="text-slate-600 font-medium">Your session is booked & confirmed.</p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
