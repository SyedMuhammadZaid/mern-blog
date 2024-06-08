import React from "react";
import { Button, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaMoon } from "react-icons/fa";

const Header = () => {
  const location = useLocation();
  return (
    <Navbar className="border-b-2">
      <Link
        to={"/"}
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 mr-1 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Programming
        </span>
        Blog
      </Link>
      <form>
        <TextInput
          type={"text"}
          placeholder="Search..."
          rightIcon={IoMdSearch}
          className="hidden lg:inline"
        />
      </form>
      <Button className="w-12 h-18 lg:hidden" color="gray" pill>
        <IoMdSearch />
      </Button>
      <div className="flex items-center gap-2 md:order-2">
        <Button className="w-12 h-9 hidden sm:inline" color="gray" pill>
          <FaMoon />
        </Button>
        <Link to={"/sign-in"}>
          <Button gradientDuoTone="purpleToBlue" outline>Sign In</Button>
        </Link>
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link as={"div"} active={location.pathname == "/"}>
          <Link to={"/"}>Home</Link>
        </Navbar.Link>
        <Navbar.Link as={"div"} active={location.pathname == "/about"}>
          <Link to={"/about"}>About</Link>
        </Navbar.Link>
        <Navbar.Link as={"div"} active={location.pathname == "/projects"}>
          <Link to={"/projects"}>Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
