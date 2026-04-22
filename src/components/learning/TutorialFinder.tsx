'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2, BookOpen, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Resource } from '@/lib/learningData';

export default function TutorialFinder() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Resource[]>([]);
    const [debouncedQuery, setDebouncedQuery] = useState('');

    // Simple debounce
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedQuery(query), 400);
        return () => clearTimeout(timer);
    }, [query]);

    useEffect(() => {
        if (debouncedQuery.length > 2) {
            searchTutorials();
        } else if (debouncedQuery.length === 0) {
            setResults([]);
        }
    }, [debouncedQuery]);

    const searchTutorials = async () => {
        setLoading(true);
        try {
            const resp = await fetch(`/api/learning/tutorials?q=${encodeURIComponent(debouncedQuery)}`);
            const data = await resp.json();
            if (data.success) {
                setResults(data.resources);
            }
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white rounded-2xl flex items-center p-2 shadow-sm border border-slate-200 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all">
                    <div className="pl-4 pr-2">
                        <Search className="h-6 w-6 text-slate-400" />
                    </div>
                    <Input 
                        placeholder="Search for any topic (e.g., 'React Hooks', 'AI Agents')..." 
                        className="border-0 focus-visible:ring-0 text-lg py-6 bg-transparent"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button 
                        size="lg" 
                        onClick={searchTutorials}
                        className="rounded-xl h-12 px-8 bg-indigo-600 hover:bg-indigo-700 font-semibold"
                    >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Discover"}
                    </Button>
                </div>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
                {results.length > 0 && (
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-indigo-500" />
                            AI Recommended for you
                        </h3>
                        <span className="text-sm text-slate-500 font-medium">{results.length} resources found</span>
                    </div>
                )}

                <div className="grid gap-4">
                    {results.map((res) => (
                        <div 
                            key={res.id}
                            className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-6 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 group"
                        >
                            <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shrink-0">
                                {res.type === 'video' ? <BookOpen className="h-8 w-8" /> : <GraduationCap className="h-8 w-8" />}
                            </div>
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-3">
                                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{res.title}</h4>
                                    <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-slate-100 text-slate-600`}>
                                        {res.complexity}
                                    </span>
                                </div>
                                <p className="text-slate-500 text-sm">{res.description}</p>
                                <div className="flex flex-wrap gap-4 pt-2">
                                    <div className="flex items-center text-xs text-slate-400 font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2" />
                                        {res.category}
                                    </div>
                                    <div className="flex items-center text-xs text-slate-400 font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 mr-2" />
                                        {res.duration} read/watch
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" className="rounded-xl font-semibold border-slate-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                                View Full Course
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    ))}

                    {debouncedQuery.length > 2 && results.length === 0 && !loading && (
                        <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
                                <Search className="h-8 w-8 text-slate-300" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-900 mb-2">No tutorials found</h3>
                            <p className="text-slate-500 max-w-sm mx-auto">We couldn't find anything matching your search. Try different keywords or browse by category.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
