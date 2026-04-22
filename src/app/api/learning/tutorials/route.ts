import { NextResponse } from "next/server";
import { resources } from "@/lib/learningData";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get('q')?.toLowerCase();
        const mood = searchParams.get('mood')?.toLowerCase();

        let filtered = resources;

        if (mood) {
            filtered = filtered.filter(r => r.moods.includes(mood));
        }

        if (query) {
            filtered = filtered.filter(r => 
                r.title.toLowerCase().includes(query) || 
                r.description.toLowerCase().includes(query) ||
                r.category.toLowerCase().includes(query)
            );
        }

        return NextResponse.json({ success: true, resources: filtered });
    } catch (error) {
        console.error("Learning API Error:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch resources" }, { status: 500 });
    }
}
