import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongoose";
import { User, MentorProfile } from "@/models";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { company, role, bio, skillsString } = body;

        if (!company || !role || !bio || !skillsString) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const skills = skillsString.split(',').map((s: string) => s.trim()).filter(Boolean);

        await connectToDatabase();

        const user = await User.findOne({ clerkId: userId });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (user.role === "MENTOR" || user.role === "ADMIN") {
            return NextResponse.json({ error: "You are already a mentor or admin" }, { status: 400 });
        }

        const MENTOR_FEE = 599;
        const amountInPaise = Math.round(MENTOR_FEE * 100);

        // Check if they already have an application
        let mentorProfile = await MentorProfile.findOne({ userId: user._id });

        if (mentorProfile) {
            if (mentorProfile.isApproved) {
                 return NextResponse.json({ error: "Your profile is already approved" }, { status: 400 });
            }
            if (mentorProfile.hasPaid) {
                 return NextResponse.json({ error: "Application already submitted and paid. Waiting for admin approval." }, { status: 400 });
            }
        }

        // Create Razorpay Order
        const order = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `mentor_app_${user._id}`,
            notes: {
                userId: user._id.toString(),
                type: "MENTOR_APPLICATION"
            }
        });

        if (mentorProfile) {
            // Update existing profile with order ID
            mentorProfile.expertise = skills;
            mentorProfile.bio = bio;
            mentorProfile.designation = role;
            mentorProfile.company = company;
            mentorProfile.paymentOrderId = order.id;
            mentorProfile.paymentStatus = "PENDING";
            await mentorProfile.save();
        } else {
            // Create new profile as PENDING
            mentorProfile = await MentorProfile.create({
                userId: user._id,
                expertise: skills,
                bio: bio,
                hourlyRate: 50,
                designation: role,
                company: company,
                isApproved: false,
                hasPaid: false,
                paymentOrderId: order.id,
                paymentStatus: "PENDING"
            });
        }

        return NextResponse.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            user: {
                name: user.name,
                email: user.email
            }
        });

    } catch (error: any) {
        console.error("Error processing mentor application:", error);
        return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
    }
}
