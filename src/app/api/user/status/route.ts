import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongoose";
import { User, MentorProfile } from "@/models";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const mentorProfile = await MentorProfile.findOne({ userId: user._id });

        return NextResponse.json({
            role: user.role,
            hasApplication: !!mentorProfile,
            isApproved: mentorProfile?.isApproved || false,
            hasPaid: mentorProfile?.hasPaid || false,
        });

    } catch (error: any) {
        console.error("Error fetching user status:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
