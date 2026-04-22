'use client';

import React, { useState } from 'react';
import { moods, resources, Resource } from '@/lib/learningData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Brain, Clock, ChevronRight } from 'lucide-react';

export default function MoodBite() {
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [recommendations, setRecommendations] = useState<Resource[]>([]);

    const handleMoodSelect = (moodId: string) => {
        setSelectedMood(moodId);
        const filtered = resources.filter(r => r.moods.includes(moodId));
        setRecommendations(filtered);
    };

    return (
        <div className="space-y-10">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-slate-900">How are you feeling <span className="text-indigo-600">today?</span></h2>
                <p className="text-slate-500">Pick a mood and we'll suggest the perfect "learning bite" for your state of mind.</p>
            </div>

            {/* Mood Selector */}
            <div className="flex flex-wrap justify-center gap-6">
                {moods.map((mood) => (
                    <button
                        key={mood.id}
                        onClick={() => handleMoodSelect(mood.id)}
                        className={`group relative flex flex-col items-center justify-center p-6 rounded-3xl transition-all duration-300 ${
                            selectedMood === mood.id 
                            ? "bg-white ring-4 ring-indigo-500/20 shadow-xl -translate-y-2" 
                            : "bg-slate-50 hover:bg-white hover:shadow-lg hover:-translate-y-1"
                        }`}
                    >
                        <span className={`text-5xl mb-4 transition-transform group-hover:scale-110 ${selectedMood === mood.id ? "scale-110" : ""}`}>
                            {mood.icon}
                        </span>
                        <span className={`font-semibold ${selectedMood === mood.id ? "text-indigo-600" : "text-slate-600"}`}>
                            {mood.name}
                        </span>
                        {selectedMood === mood.id && (
                            <div className="absolute -top-2 -right-2">
                                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] shadow-lg">
                                    <Sparkles className="h-3 w-3" />
                                </span>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Recommendations */}
            {selectedMood && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                            <Brain className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 uppercase tracking-tight">AI Curated Picks</h3>
                            <p className="text-sm text-slate-500">Optimized for your "{moods.find(m => m.id === selectedMood)?.name}" state</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendations.length > 0 ? (
                            recommendations.map((resource) => (
                                <Card key={resource.id} className="group overflow-hidden border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider">
                                                {resource.category}
                                            </span>
                                            <span className="flex items-center text-slate-400 text-xs font-medium">
                                                <Clock className="h-3 w-3 mr-1" />
                                                {resource.duration}
                                            </span>
                                        </div>
                                        <CardTitle className="text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">{resource.title}</CardTitle>
                                        <CardDescription className="text-slate-500 line-clamp-2">{resource.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button variant="ghost" className="w-full justify-between text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 group/btn">
                                            Start Learning
                                            <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                                <p className="text-slate-500 italic">No specific bites found for this mood yet. Try another one!</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
