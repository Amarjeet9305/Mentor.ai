"use client";

import { useState, useEffect } from "react";
import { useUser, useAuth, useClerk } from "@clerk/nextjs";
import { Briefcase, CheckCircle2, Loader2, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function BecomeMentorPage() {
    const { isSignedIn, isLoaded, user } = useUser();
    const { openSignIn } = useClerk();
    
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [applicationStatus, setApplicationStatus] = useState<"NONE" | "PENDING" | "APPROVED">("NONE");

    const [formData, setFormData] = useState({
        company: "",
        role: "",
        bio: "",
        skills: ""
    });

    useEffect(() => {
        if (isLoaded && isSignedIn && user) {
            checkExistingStatus();
        } else if (isLoaded && !isSignedIn) {
             setCheckingStatus(false);
        }
    }, [isLoaded, isSignedIn, user]);

    const checkExistingStatus = async () => {
        try {
            const res = await fetch("/api/user/status"); // Corrected endpoint
            const data = await res.json();
            
            if (data.role === "MENTOR" || data.role === "ADMIN") {
                setApplicationStatus("APPROVED");
            } else if (data.hasApplication && data.hasPaid && !data.isApproved) {
                setApplicationStatus("PENDING");
            }
        } catch (err) {
            console.error("Error checking status:", err);
        } finally {
            setCheckingStatus(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!isSignedIn) {
            toast.error("Please login first");
            openSignIn();
            return;
        }

        setSubmitting(true);

        try {
            const res = await fetch("/api/mentors/apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    company: formData.company,
                    role: formData.role,
                    bio: formData.bio,
                    skillsString: formData.skills
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to submit application");
            }

            // Trigger Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency,
                name: "Aura.Ai Mentorship",
                description: "Mentor Application Fee",
                order_id: data.orderId,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await fetch("/api/mentors/verify-payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        const verifyData = await verifyRes.json();
                        
                        if (verifyRes.ok) {
                            toast.success("Application submitted successfully!");
                            setApplicationStatus("PENDING");
                        } else {
                            toast.error(verifyData.error || "Payment verification failed");
                        }
                    } catch (err) {
                        toast.error("Payment verified but update failed. Contact support.");
                    }
                },
                prefill: {
                    name: user?.fullName || "",
                    email: user?.primaryEmailAddress?.emailAddress || "",
                },
                theme: { color: "#4f46e5" }
            };

            //@ts-ignore
            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err: any) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (checkingStatus) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    if (applicationStatus === "APPROVED") {
        return (
            <div className="min-h-screen bg-slate-50 py-20 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md text-center">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">You're already a Mentor!</h2>
                    <p className="text-slate-600 mb-8">Your account is fully upgraded. Head over to your dashboard to manage your sessions.</p>
                    <a href="/dashboard">
                        <Button className="w-full">Go to Dashboard</Button>
                    </a>
                </div>
            </div>
        );
    }

    if (applicationStatus === "PENDING") {
        return (
            <div className="min-h-screen bg-slate-50 py-20 flex items-center justify-center">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 max-w-md text-center">
                    <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Loader2 className="w-8 h-8 animate-spin" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Pending</h2>
                    <p className="text-slate-600 mb-8">We've received your application and payment. Our admin is reviewing it. You'll be notified once approved!</p>
                    <a href="/dashboard">
                        <Button variant="outline" className="w-full">Back to Dashboard</Button>
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 lg:py-20">
            <div className="container mx-auto px-4 max-w-2xl">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
                        <Briefcase className="w-8 h-8 -rotate-12" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-4">Become a Mentor</h1>
                    <p className="text-lg text-slate-600">Share your expertise and guide the next generation of AI professionals.</p>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                    <div className="mb-8 p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex items-start gap-4 text-indigo-900">
                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center shrink-0">
                            <IndianRupee className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold">One-time Application Fee: ₹599</h3>
                            <p className="text-sm opacity-90">Pay once to apply. This helps us ensure high-quality mentorship for our students.</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="company" className="block text-sm font-medium text-slate-700 mb-1">Current Company</label>
                            <input
                                type="text"
                                id="company"
                                name="company"
                                required
                                value={formData.company}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-shadow"
                                placeholder="e.g. Google, OpenAI, Startup Inc."
                            />
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-slate-700 mb-1">Job Role</label>
                            <input
                                type="text"
                                id="role"
                                name="role"
                                required
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-shadow"
                                placeholder="e.g. Senior ML Engineer, Data Scientist"
                            />
                        </div>

                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1">Professional Bio</label>
                            <textarea
                                id="bio"
                                name="bio"
                                rows={4}
                                required
                                value={formData.bio}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-shadow resize-none"
                                placeholder="Tell mentees about your experience and what you can help them with..."
                            />
                        </div>

                        <div>
                            <label htmlFor="skills" className="block text-sm font-medium text-slate-700 mb-1">Key Skills (comma separated)</label>
                            <input
                                type="text"
                                id="skills"
                                name="skills"
                                required
                                value={formData.skills}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none transition-shadow"
                                placeholder="e.g. Python, PyTorch, System Design, Career Advice"
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <Button 
                                type="submit" 
                                className="w-full text-lg py-7 font-bold shadow-md shadow-indigo-600/20"
                                disabled={submitting}
                            >
                                {submitting ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : "Pay ₹599 & Submit"}
                            </Button>
                            <p className="text-center text-xs text-slate-500 mt-4">
                                Secure payment via Razorpay. By applying, you agree to our terms of service.
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
