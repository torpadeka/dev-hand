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
import { useRouter } from "next/navigation";

interface NavbarAvatarProps {
  user: SelectUser;
}

export default function NavbarAvatar({ user }: NavbarAvatarProps) {
  const router = useRouter();
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

  const handleLogout = () => {
    router.push("/auth/logout");
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Avatar className="h-10 w-10 border-2 border-border hover:border-button transition-colors">
            <AvatarImage
              src={user.username || "/placeholder.svg"}
              alt={user.username}
            />
            <AvatarFallback className="bg-primary text-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-chart-2 border-2 border-background" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-64 p-2 bg-primary border-border"
      >
        <div className="flex items-center gap-3 p-2 mb-1">
          <Avatar className="h-10 w-10 border-2 border-border">
            <AvatarImage
              src={user.username || "/placeholder.svg"}
              alt={user.username}
            />
            <AvatarFallback className="bg-chart-3/20 text-chart-3">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium">{user.username}</p>
            <p className="text-xs text-foreground/60">{user.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer hover:bg-background">
          <User className="h-4 w-4 text-foreground/70" />
          <span>My Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer hover:bg-background">
          <Bell className="h-4 w-4 text-foreground/70" />
          <span>Notifications</span>
          <div className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-chart-5/20 text-chart-5 text-xs font-medium">
            3
          </div>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer hover:bg-background">
          <CreditCard className="h-4 w-4 text-foreground/70" />
          <span>Subscription</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-border" />

        <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer hover:bg-background">
          <Settings className="h-4 w-4 text-foreground/70" />
          <span>Edit Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 py-2 cursor-pointer text-destructive hover:bg-background">
          <LogOut className="h-4 w-4" />
          <span onClick={handleLogout}>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
