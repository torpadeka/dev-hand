"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <h1 className="text-2xl font-bold text-chart-2">
        Thread Created Successfully! 🎉
      </h1>
      <p className="text-foreground mt-2">Redirecting you to the homepage...</p>
    </div>
  );
}
