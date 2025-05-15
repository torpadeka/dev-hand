"use client";

import Image from "next/image";
import NavbarAvatar from "./NavbarAvatar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // ✅ keep this

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch("/api/auth/get-user");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        router.push("/auth/login");
      }
    };

    getUser();
  }, [router]);

  if (!user) return null;

  return (
    <div className="w-full h-16 flex items-center justify-between px-6 border-b-2 border-border">
      <a href="/">
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/dev-hand.svg"
            width={40}
            height={40}
            alt="Dev Hand logo"
          />
          <div className="font-bold text-2xl text-logo">Dev Hand</div>
        </div>
      </a>
      <div className="flex items-center gap-10">
        <a href="/expert/apply">Apply as Expert</a>
        <NavbarAvatar user={user} />
      </div>
    </div>
  );
}
