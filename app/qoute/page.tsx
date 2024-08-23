import HugotBody from "@/components/HugotBody";
import Nav from "@/components/Nav";
import People from "@/components/People";
import Trending from "@/components/Trending";

import React from "react";

const Qoutes = () => {
  return (
    <div>
      <Nav />
      <main className="flex flex-col items-center justify-center">
        <div>
          <Trending />
        </div>
      </main>
    </div>
  );
};

export default Qoutes;
