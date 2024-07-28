import React from "react";
import CallToAction from "../components/CallToAction";

const Projects = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto flex flex-col gap-3 px-2">
        <h2 className="text-center font-semibold text-2xl md:text-3xl">
          Projects
        </h2>
        <p className="text-center">
          Build fun and engaging projects while learning HTML, CSS, and
          JavaScript!
        </p>
        <div>
          <CallToAction />
        </div>
      </div>
    </div>
  );
};

export default Projects;
