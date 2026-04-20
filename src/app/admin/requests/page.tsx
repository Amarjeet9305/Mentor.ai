"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { CheckCircle2, XCircle, Loader2, User, Mail, Briefcase, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface MentorRequest {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        image: string;
    };
    expertise: string[];
    bio: string;
    designation: string;
    company: string;
    hasPaid: boolean;
    isApproved: boolean;
}

export default function AdminRequestsPage() {
    const { user: clerkUser, isLoaded } = useUser();
    const [requests, setRequests] = useState<MentorRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        if (isLoaded) {
            fetchRequests();
        }
    }, [isLoaded]);

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/admin/mentor-requests");
            const data = await res.json();
            if (res.ok) {
                setRequests(data.requests || []);
            } else {
                 toast.error(data.error || "Failed to fetch requests");
            }
        } catch (err) {
            console.error("Error fetching requests:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (profileId: string, action: "APPROVE" | "REJECT") => {
        setProcessing(profileId);
        try {
            const res = await fetch("/api/admin/mentor-requests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profileId, action })
            });
            const data = await res.json();
            
            if (res.ok) {
                toast.success(data.message || "Action processed successfully");
                // Remove from list
                setRequests(prev => prev.filter(r => r._id !== profileId));
            } else {
                toast.error(data.error || "Failed to process action");
            }
        } catch (err) {
             toast.error("An error occurred");
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="mb-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Mentor Applications</h1>
                        <p className="text-slate-600">Review and approve new mentor requests from students.</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg border border-slate-200">
                        <span className="text-sm font-semibold text-slate-500 mr-2">Total Pending:</span>
                        <span className="text-xl font-bold text-indigo-600">{requests.length}</span>
                    </div>
                </div>

                {requests.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-20 text-center">
                        <div className="w-20 h-20 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <User className="w-10 h-10" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900 mb-2">No pending requests</h2>
                        <p className="text-slate-600">When students pay the application fee, their details will appear here.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                        {requests.map((request) => (
                            <div key={request._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6 lg:p-8 flex flex-col lg:flex-row gap-8">
                                    {/* User Bio Section */}
                                    <div className="flex-1 space-y-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-14 h-14 bg-slate-100 rounded-full overflow-hidden shrink-0 border-2 border-indigo-100">
                                                 {request.userId.image ? (
                                                     <img src={request.userId.image} alt={request.userId.name} className="w-full h-full object-cover" />
                                                 ) : (
                                                     <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                         <User className="w-8 h-8" />
                                                     </div>
                                                 )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-xl font-bold text-slate-900">{request.userId.name}</h3>
                                                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                                    <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {request.userId.email}</span>
                                                    <span className="flex items-center gap-1 font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                                        <CheckCircle2 className="w-3 h-3" /> Fee Paid (₹599)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Company</span>
                                                <p className="text-slate-900 font-semibold flex items-center gap-2"><Briefcase className="w-4 h-4 text-indigo-500" /> {request.company}</p>
                                            </div>
                                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Designation</span>
                                                <p className="text-slate-900 font-semibold flex items-center gap-2"><Award className="w-4 h-4 text-indigo-500" /> {request.designation}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Expertise</span>
                                            <div className="flex flex-wrap gap-2">
                                                {request.expertise.map((skill, i) => (
                                                    <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg text-sm font-medium border border-indigo-100">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Bio</span>
                                            <p className="text-slate-700 leading-relaxed italic bg-emerald-50/30 p-4 rounded-xl border border-emerald-100">
                                                "{request.bio}"
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions Section */}
                                    <div className="lg:w-64 flex flex-row lg:flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                                        <Button 
                                            onClick={() => handleAction(request._id, "APPROVE")}
                                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 shadow-sm shadow-emerald-600/20"
                                            disabled={processing === request._id}
                                        >
                                            {processing === request._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Approve <CheckCircle2 className="ml-2 w-5 h-5" /></>}
                                        </Button>
                                        <Button 
                                            variant="outline"
                                            onClick={() => handleAction(request._id, "REJECT")}
                                            className="flex-1 border-rose-200 text-rose-600 hover:bg-rose-50 font-bold h-12"
                                            disabled={processing === request._id}
                                        >
                                           Reject <XCircle className="ml-2 w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
