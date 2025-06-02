"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Menu, X } from "lucide-react";
import NavbarAvatar from "./NavbarAvatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/auth/get-user");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [router]);

  // Navigation links
  const navLinks = [
    { name: "Home", href: "/" },
    // { name: "Projects", href: "/projects" },
    // { name: "Community", href: "/community" },
  ];

  if (loading) {
    return (
      <div className="w-full h-16 flex items-center justify-between px-6 border-b border-border bg-primary">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-md" />
          <Skeleton className="h-8 w-32 rounded-md" />
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-32 rounded-md hidden md:block" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="sticky top-0 z-50 w-full h-16 flex items-center justify-between px-4 md:px-6 border-b border-border bg-primary backdrop-blur-sm bg-opacity-80">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative h-10 w-10 overflow-hidden rounded-md flex items-center justify-center transition-colors">
            <Image
              src="/dev-hand.svg"
              width={32}
              height={32}
              alt="Dev Hand logo"
              className="transition-transform group-hover:scale-110 duration-300"
            />
          </div>
          <div className="font-bold text-xl md:text-2xl text-logo hidden sm:block">
            Dev Hand
          </div>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className="text-foreground hover:text-button transition-colors"
          >
            {link.name}
          </Link>
        ))}
        <Link href="/expert/apply">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-border hover:bg-background hover:text-button"
          >
            <Award className="h-4 w-4" />
            Apply as Expert
          </Button>
        </Link>
        <NavbarAvatar user={user} />
      </div>

      
    </div>
  );
}
