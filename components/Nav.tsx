"use client";
import React, { useState, useEffect } from "react";
import ProfilePic from "./ProfilePic";
import AddHugot from "./AddHugot";
import { ModeToggle } from "./mode-toggle";

const Nav = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`flex justify-between sticky top-0 z-50 h-14 w-full p-3 transition-all duration-300 ${
        isScrolled ? "bg-slate-800 backdrop-blur-sm " : "bg-transparent"
      }`}
    >
      <ProfilePic />
      <AddHugot />
      <ModeToggle />
    </nav>
  );
};

export default Nav;
