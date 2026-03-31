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
        if (!user || user.role !== "ADMIN") {
             return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Fetch pending mentor profiles with user details
        const requests = await MentorProfile.find({ 
            hasPaid: true, 
            isApproved: false 
        }).populate("userId", "name email image");

        return NextResponse.json({ requests });

    } catch (error: any) {
        console.error("Error fetching mentor requests:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { userId: adminClerkId } = await auth();
        if (!adminClerkId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        const adminUser = await User.findOne({ clerkId: adminClerkId });
        if (!adminUser || adminUser.role !== "ADMIN") {
             return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const { profileId, action } = body; // action: "APPROVE" | "REJECT"

        if (!profileId || !action) {
             return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const profile = await MentorProfile.findById(profileId);
        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        if (action === "APPROVE") {
            profile.isApproved = true;
            await profile.save();

            // Also update user role to MENTOR
            await User.findByIdAndUpdate(profile.userId, {
                role: "MENTOR"
            });

            return NextResponse.json({ success: true, message: "Mentor approved successfully" });
        } else if (action === "REJECT") {
             // In a real app, maybe refund or just mark as rejected
             // For now, let's just delete the profile or reset it
             await MentorProfile.findByIdAndDelete(profileId);
             return NextResponse.json({ success: true, message: "Request rejected" });
        } else {
             return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

    } catch (error: any) {
        console.error("Error updating mentor status:", error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
