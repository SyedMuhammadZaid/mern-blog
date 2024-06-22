import { Footer } from "flowbite-react";
import React from "react";
import { Link } from "react-router-dom";
import { TiSocialFacebook } from "react-icons/ti";
import { TiSocialYoutube } from "react-icons/ti";
import { TiSocialTwitter } from "react-icons/ti";
import { TiSocialLinkedin } from "react-icons/ti";

const FooterComp = () => {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="w-full">
        <div className="w-full">
          <div>
            <Link
              to={"/"}
              className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
            >
              <span className="px-2 mr-1 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Programming
              </span>
              Blog
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-6 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="ABOUT" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">100 js Projects</Footer.Link>
                <Footer.Link href="#">Programming Blog</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="FOLLOW US" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://www.github.com/SyedMuhammadZaid"
                  target="_blank"
                >
                  Github
                </Footer.Link>
                <Footer.Link href="#">Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div className="mt-6 sm:mt-0">
              <Footer.Title title="LEGAL" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
                <Footer.Link href="#">Terms and Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
          <Footer.Divider />
          <div className="w-full sm:flex sm:items-center sm:justify-between">
            <Footer.Copyright href="#" by="ProgrammingBlog™" year={new Date().getFullYear()} />
            <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
              <Footer.Icon href="#" icon={TiSocialFacebook} />
              <Footer.Icon href="#" icon={TiSocialYoutube} />
              <Footer.Icon href="#" icon={TiSocialTwitter} />
              <Footer.Icon href="#" icon={TiSocialLinkedin} />
            </div>
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComp;
