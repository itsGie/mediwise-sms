"use client";
import { ThemeModeToggle } from "@/components/ThemeModeToggle";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/useModalStore";
import Link from "next/link";
import React from "react";
import MobileLinks from "./MobileLinks";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { onOpen } = useModal();
  const router = useRouter()
  return (
    <nav className="sticky top-0 bg-white border-gray-200 dark:bg-gray-900 flex items-center justify-center w-full gap-x-5 max-h-[90px] z-50">
      {/* <ArrowLeft
        className="w-5 h-5 cursor-pointer rounded-md text-zinc-500 justify-start"
        onClick={() => router.push(`/`)}
      /> */}
      <div className="flex w-full px-3 md:w-[70%] items-center justify-between">
      
      
        <img
          src="/images/bhaLogo.png"
          className="w-[70px] md:w-[90px] "
          alt=""
        />
        <ul className="flex items-center gap-x-1 md:gap-x-5 text-sm">
          <Link href="#home" className="hidden md:block px-5 py-3 font-semibold text-[16px]  hover:text-primary">
            Home
          </Link>
          <Link
            href="#about-us"
            className="hidden md:block px-5 py-3 font-semibold text-[16px]  hover:text-primary"
          >
            About us
          </Link>
          <Link
            href="#guidelines"
            className="hidden md:block px-5 py-3 font-semibold text-[16px]  hover:text-primary"
          >
            Guidelines
          </Link>
          <Link
            href="#contact-us"
            className="hidden md:block px-5 py-3 font-semibold text-[16px] hover:text-primary"
          >
            Contact Us
          </Link>
          <MobileLinks />
          <ThemeModeToggle />
        </ul>
        <Button
          variant={"default"}
          onClick={() => onOpen("mediwiseLogin")}
          className="rounded-xl"
        >
          Login
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
