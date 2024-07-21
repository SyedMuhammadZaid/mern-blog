import { Button } from "flowbite-react";
import React from "react";

const CallToAction = () => {
  return (
    <div className="w-full flex flex-col md:flex-row border border-teal-500 rounded-tl-xl rounded-br-xl">
      <div className="flex-1 flex items-center justify-center flex-col md:py-2 py-4 text-center">
        <h2 className="text-2xl font-semibold">
          Want to learn more about Java-script
        </h2>
        <p className="text-gray-600 font-medium">
          Check out these resources with 100 javascript projects
        </p>
        <Button
          className="w-4/5 my-2 rounded-tl-xl rounded-br-xl"
          gradientDuoTone={"purpleToPink"}
        >
          <a href="https://www.100jsprojects.com/" target="_blank">
            Learn More
          </a>
        </Button>
      </div>
      <div className="flex-1 p-4">
        <img
          src="https://miro.medium.com/v2/resize:fit:1400/1*LyZcwuLWv2FArOumCxobpA.png"
          className="w-2/3 md:w-full mx-auto"
        />
      </div>
    </div>
  );
};

export default CallToAction;
