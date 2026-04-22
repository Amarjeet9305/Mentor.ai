'use client';

import React, { useState } from 'react';
import TutorialFinder from '@/components/learning/TutorialFinder';
import MoodBite from '@/components/learning/MoodBite';
import { BookOpen, Sparkles, BrainCircuit, LayoutGrid, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LearningResourcesPage() {
    return (
        <div className="min-h-screen bg-slate-50/50">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-indigo-900 py-24 lg:py-32">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/20 blur-[120px] rounded-full"></div>
                
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-200 text-sm font-medium border border-indigo-400/20 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
                        <Sparkles className="h-4 w-4" />
                        Next-Gen AI Learning
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
                        Learning Resources <span className="text-indigo-400">Reimagined</span>
                    </h1>
                    <p className="text-lg text-indigo-100/80 max-w-2xl mx-auto leading-relaxed">
                        Discover tutorials tailored to your learning path or use MoodBite to find the perfect content for your current mental state.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 -mt-12 pb-24 relative z-20">
                <Tabs defaultValue="moodbite" className="w-full">
                    <div className="flex justify-center mb-12">
                        <TabsList className="h-16 p-1.5 bg-white shadow-xl shadow-indigo-900/5 rounded-2xl border border-slate-200">
                            <TabsTrigger 
                                value="moodbite" 
                                className="px-8 rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-bold transition-all gap-2"
                            >
                                <BrainCircuit className="h-5 w-5" />
                                MoodBite AI
                            </TabsTrigger>
                            <TabsTrigger 
                                value="finder" 
                                className="px-8 rounded-xl data-[state=active]:bg-indigo-600 data-[state=active]:text-white font-bold transition-all gap-2"
                            >
                                <Search className="h-5 w-5" />
                                Tutorial Finder
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="moodbite" className="outline-none focus:ring-0">
                        <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-2xl shadow-indigo-900/5 border border-slate-100">
                            <MoodBite />
                        </div>
                    </TabsContent>

                    <TabsContent value="finder" className="outline-none focus:ring-0">
                        <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-2xl shadow-indigo-900/5 border border-slate-100">
                            <div className="text-center mb-12 space-y-4">
                                <h2 className="text-3xl font-bold text-slate-900">Discover <span className="text-indigo-600">Anything</span></h2>
                                <p className="text-slate-500">Our AI scans thousands of high-quality resources to bring you the best ones.</p>
                            </div>
                            <TutorialFinder />
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Footer Section / Categories */}
                <div className="mt-24 grid grid-cols-1 md:grid-cols-4 gap-8">
                    {[
                        { title: 'Project Based', desc: 'Learn by doing', icon: <LayoutGrid className="h-6 w-6" /> },
                        { title: 'Video Courses', desc: 'Visual learning', icon: <BookOpen className="h-6 w-6" /> },
                        { title: 'Interactive', desc: 'Code in browser', icon: <Sparkles className="h-6 w-6" /> },
                        { title: 'Bitesized', desc: 'Fast & efficient', icon: <BrainCircuit className="h-6 w-6" /> },
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-4 p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                            <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                {feature.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900">{feature.title}</h4>
                                <p className="text-xs text-slate-500">{feature.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
