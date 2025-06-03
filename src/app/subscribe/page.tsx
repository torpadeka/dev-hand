// app/subscribe/page.tsx
"use client";

import Navbar from "@/components/Navbar"; // Adjust path if necessary
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star, Users, Briefcase, Zap } from "lucide-react"; // Example icons

// Define your subscription plans
const plans = [
    {
        name: "Hobbyist",
        price: "$4.99",
        billingCycle: "/month",
        description:
            "Perfect for individuals starting out or working on personal projects.",
        features: [
            {
                text: "Ad-free experience",
                icon: <Zap className="h-5 w-5 text-green-500" />,
            },
            {
                text: "Priority threads access",
                icon: <Zap className="h-5 w-5 text-green-500" />,
            },
            {
                text: "Ask experts directly",
                icon: <Users className="h-5 w-5 text-green-500" />,
            },
            {
                text: "More profile customization",
                icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
            },
        ],
        buttonLabel: "Choose Hobbyist",
        bgColor: "bg-neutral-800", // Slightly different background for cards
        borderColor: "border-neutral-700",
        textColor: "text-neutral-100",
        buttonVariant: "outline" as "outline" | "default", // Added type assertion
        recommended: false,
    },
    {
        name: "Power User",
        price: "$12.99",
        billingCycle: "/month",
        description:
            "For professionals that are actively developing and creating new innovations.",
        features: [
            {
                text: "All Hobbyist features",
                icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
            },
            {
                text: "Expert-priority threads",
                icon: <Zap className="h-5 w-5 text-green-500" />,
            },
            {
                text: "Private chats with experts",
                icon: <Briefcase className="h-5 w-5 text-green-500" />,
            },
            {
                text: "Even more profile customization",
                icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
            },
            {
                text: "Get a custom Power Badge!",
                icon: <Users className="h-5 w-5 text-green-500" />,
            },
        ],
        buttonLabel: "Choose Power User",
        bgColor: "bg-primary", // Using your primary color for emphasis
        borderColor: "border-blue-500", // Accent border for recommended
        textColor: "text-white",
        buttonVariant: "default" as "outline" | "default", // Assuming 'default' uses accent colors
        recommended: true,
        badgeText: "Most Popular",
    },
    {
        name: "Overkill",
        price: "$24.99",
        billingCycle: "/month",
        description:
            "For those who wish to support Dev Hand and get the maximum benefits.",
        features: [
            {
                text: "All Professional features",
                icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
            },
            {
                text: "Direct Dev Hand support channels",
                icon: <Users className="h-5 w-5 text-green-500" />,
            },
            {
                text: "Private group chats with experts",
                icon: <Briefcase className="h-5 w-5 text-green-500" />,
            },
            {
                text: "Give suggestions and vote on new features!",
                icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
            },
            {
                text: "Get a custom Overkill Badge!",
                icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
            },
        ],
        buttonLabel: "Choose Overkill",
        bgColor: "bg-neutral-800",
        borderColor: "border-neutral-700",
        textColor: "text-neutral-100",
        buttonVariant: "outline" as "outline" | "default",
        recommended: false,
    },
];

export default function SubscriptionPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-logo mb-4">
                        Find the Plan That's Right For You
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                        Start for free, then upgrade to a plan that fits your
                        needs. No hidden fees, cancel anytime.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`rounded-xl shadow-2xl p-6 flex flex-col relative border ${
                                plan.borderColor
                            } ${plan.bgColor} ${
                                plan.recommended ? "ring-2 ring-blue-500" : ""
                            }`}
                        >
                            {plan.recommended && plan.badgeText && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                                    <Star className="h-3 w-3" />
                                    {plan.badgeText}
                                </div>
                            )}
                            <h2
                                className={`text-2xl font-semibold mb-1 ${
                                    plan.recommended
                                        ? "text-white"
                                        : "text-logo"
                                }`}
                            >
                                {plan.name}
                            </h2>
                            <div className="flex items-baseline mb-4">
                                <span
                                    className={`text-4xl font-extrabold ${
                                        plan.recommended
                                            ? "text-white"
                                            : "text-foreground"
                                    }`}
                                >
                                    {plan.price}
                                </span>
                                <span
                                    className={`ml-1 text-sm ${
                                        plan.recommended
                                            ? "text-blue-200"
                                            : "text-muted-foreground"
                                    }`}
                                >
                                    {plan.billingCycle}
                                </span>
                            </div>
                            <p
                                className={`mb-6 min-h-[60px] ${
                                    plan.recommended
                                        ? "text-blue-100"
                                        : "text-muted-foreground"
                                }`}
                            >
                                {plan.description}
                            </p>

                            <ul className="space-y-3 mb-8 flex-grow">
                                {plan.features.map((feature, index) => (
                                    <li
                                        key={index}
                                        className="flex items-start"
                                    >
                                        <span className="flex-shrink-0 mr-2 mt-1">
                                            {feature.icon}
                                        </span>
                                        <span
                                            className={`${
                                                plan.recommended
                                                    ? "text-blue-50"
                                                    : "text-foreground"
                                            }`}
                                        >
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant={plan.buttonVariant}
                                size="lg"
                                className={`w-full mt-auto ${
                                    plan.recommended
                                        ? "bg-white text-primary hover:bg-gray-200"
                                        : "hover:bg-accent hover:text-accent-foreground"
                                }`}
                            >
                                {plan.buttonLabel}
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-16">
                    <p className="text-muted-foreground">
                        Have any questions?{" "}
                        <a
                            href="/contact"
                            className="text-logo hover:underline font-semibold"
                        >
                            Contact Us
                        </a>
                    </p>
                </div>
            </main>

            <footer className="py-8 border-t border-border text-center text-muted-foreground">
                <p>
                    &copy; {new Date().getFullYear()} Dev Hand. All rights
                    reserved.
                </p>
            </footer>
        </div>
    );
}
