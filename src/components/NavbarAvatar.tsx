"use client";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    MdNotifications,
    MdPersonOutline,
    MdSubscriptions,
} from "react-icons/md";

export default function NavbarAvatar() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="border-2 border-gray-700">
                    <AvatarImage src=""></AvatarImage>
                    <AvatarFallback>DH</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    Profile
                    <DropdownMenuShortcut>
                        <MdPersonOutline size={20} />
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Notifications
                    <DropdownMenuShortcut>
                        <MdNotifications size={20} />
                    </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Subscription
                    <DropdownMenuShortcut>
                        <MdSubscriptions size={20} />
                    </DropdownMenuShortcut>
                </DropdownMenuItem> */}
                <Card>
                    <CardHeader>
                        <CardTitle>Card Title</CardTitle>
                        <CardDescription>Card Description</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Card Content</p>
                    </CardContent>
                    <CardFooter>
                        <p>Card Footer</p>
                    </CardFooter>
                </Card>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
