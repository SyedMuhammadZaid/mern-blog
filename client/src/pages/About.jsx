import React from "react";

const About = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto flex flex-col gap-3 px-2">
        <h2 className="text-center font-semibold text-2xl md:text-3xl">About Zaid's Blog</h2>
        <p className="text-center">
          Welcome to Zaid's Blog! This blog was created by Syed Muhammad Zaid as a
          personal project to share his thoughts and ideas with the world. Zaid
          is a passionate developer who loves to write about technology, coding,
          and everything in between.<br></br><br></br> On this blog, you'll find weekly articles
          and tutorials on topics such as web development, software engineering,
          and programming languages. Zaid is always learning and exploring new
          technologies, so be sure to check back often for new content! <br></br><br></br> We
          encourage you to leave comments on our posts and engage with other
          readers. You can like other people's comments and reply to them as
          well. We believe that a community of learners can help each other grow
          and improve.
        </p>
      </div>
    </div>
  );
};

export default About;
