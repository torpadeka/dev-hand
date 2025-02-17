import Image from "next/image";
import NavbarAvatar from "./NavbarAvatar";

export default function Navbar() {
  return (
    <div className="w-full h-16 flex items-center justify-between px-6 border-b-2 border-border">
      <a href="/">
        <div className="flex items-center justify-center gap-2">
          <Image src="/dev-hand.svg" width={40} height={40} alt="#"></Image>
          <div className="font-bold text-2xl text-logo">Dev Hand</div>
        </div>
      </a>
      <div>
        <NavbarAvatar></NavbarAvatar>
      </div>
    </div>
  );
}
