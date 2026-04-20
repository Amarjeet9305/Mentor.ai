import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import connectToDatabase from "@/lib/mongoose";
import { User, MentorProfile } from "@/models";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const { userId: clerkId } = await auth();

        if (!clerkId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = body;

        // Verify signature
        const secret = process.env.RAZORPAY_KEY_SECRET;
        const generated_signature = crypto
            .createHmac("sha256", secret!)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
        }

        await connectToDatabase();

        const user = await User.findOne({ clerkId });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const mentorProfile = await MentorProfile.findOne({ 
            userId: user._id,
            paymentOrderId: razorpay_order_id 
        });

        if (!mentorProfile) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        mentorProfile.hasPaid = true;
        mentorProfile.paymentStatus = "SUCCESS";
        await mentorProfile.save();

        return NextResponse.json({ 
            success: true, 
            message: "Payment verified successfully. Your application is now pending admin approval." 
        });

    } catch (error: any) {
        console.error("Error verifying mentor payment:", error);
        return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
    }
}
