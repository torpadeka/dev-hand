"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User, Bell, CreditCard } from "lucide-react";
import { SelectUser } from "@/schema";

interface NavbarAvatarProps {
  user: SelectUser;
}

export default function NavbarAvatar({ user }: NavbarAvatarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getInitials = (username: string) => {
    return username
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const initials = getInitials(user.username);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Avatar className="h-10 w-10 border-2 border-[hsl(var(--border))] hover:border-[hsl(var(--button))] transition-colors">
            <AvatarImage
              src={user.username || "/placeholder.svg"}
              alt={user.username}
            />
            <AvatarFallback className="bg-[hsl(var(--primary))] text-[hsl(var(--foreground))]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[hsl(var(--chart-2))] border-2 border-[hsl(var(--background))]" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 p-2 bg-[hsl(var(--primary))] border-[hsl(var(--border))]"
      >
        <div className="flex items-center gap-3 p-2 mb-1">
          <Avatar className="h-10 w-10 border-2 border-[hsl(var(--border))]">
            <AvatarImage
              src={user.username || "/placeholder.svg"}
              alt={user.username}
            />
            <AvatarFallback className="bg-[hsl(var(--chart-3)/0.2)] text-[hsl(var(--chart-3))]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium">{user.username}</p>
            <p className="text-xs text-[hsl(var(--foreground)/0.6)]">
              {user.email}
            </p>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-[hsl(var(--border))]" />

        <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer hover:bg-[hsl(var(--background))]">
          <User className="h-4 w-4 text-[hsl(var(--foreground)/0.7)]" />
          <span>My Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer hover:bg-[hsl(var(--background))]">
          <Bell className="h-4 w-4 text-[hsl(var(--foreground)/0.7)]" />
          <span>Notifications</span>
          <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--chart-5)/0.2)] text-[hsl(var(--chart-5))] text-xs font-medium">
            3
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer hover:bg-[hsl(var(--background))]">
          <CreditCard className="h-4 w-4 text-[hsl(var(--foreground)/0.7)]" />
          <span>Subscription</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-[hsl(var(--border))]" />

        <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer hover:bg-[hsl(var(--background))]">
          <Settings className="h-4 w-4 text-[hsl(var(--foreground)/0.7)]" />
          <span>Edit Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer text-[hsl(var(--destructive))] hover:bg-[hsl(var(--background))]">
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
