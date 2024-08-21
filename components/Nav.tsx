import React from "react";
import ProfilePic from "./ProfilePic";
import AddHugot from "./AddHugot";
import { ModeToggle } from "./mode-toggle";

const Nav = () => {
  return (
    <nav className="flex justify-between sticky top-0 z-50 h-14 w-full p-3 ">
      <ProfilePic />
      <AddHugot />
      <ModeToggle />
    </nav>
  );
};

export default Nav;
