import HugotBody from "@/components/HugotBody";
import Nav from "@/components/Nav";
import People from "@/components/People";
import Trending from "@/components/Trending";

import React from "react";

const Qoutes = () => {
  return (
    <div>
      <Nav />
      <main className="grid grid-cols-4  gap-2 justify-between">
        <div className="col-span-1">
          {" "}
          <Trending />
        </div>
        <div className="col-span-2 flex flex-col ">
          <HugotBody />
        </div>
        <div>
          {" "}
          <People />
        </div>
      </main>
    </div>
  );
};

export default Qoutes;
