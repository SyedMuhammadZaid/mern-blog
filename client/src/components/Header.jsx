import React, { useEffect, useState } from "react";
import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { IoMdSearch } from "react-icons/io";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice";
import { signOut } from "../redux/user/userSlice";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state?.user);
  const { theme } = useSelector((state) => state?.theme);

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const search = new URLSearchParams(location.search);
    const searchQuery = search.get("searchTerm");
    if (searchQuery) {
      setSearchTerm(searchQuery);
    }
  }, [location.search]);

  const themeHandler = () => {
    dispatch(toggleTheme());
  };

  const signOutAccountHandler = async () => {
    try {
      let res = await fetch("/api/user/signout", {
        method: "POST",
      });
      let data = await res.json();
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();
    if (searchTerm) {
      const search = new URLSearchParams(location.search);
      search.set("searchTerm", searchTerm);
      const searchQueryStr = searchTerm.toString();
      navigate(`/search?searchTerm=${searchQueryStr}`);
    }
  };

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
      <form onSubmit={formSubmitHandler}>
        <TextInput
          type={"text"}
          placeholder="Search..."
          rightIcon={IoMdSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className="w-12 h-18 lg:hidden" color="gray" pill>
        <IoMdSearch />
      </Button>
      <div className="flex items-center gap-2 md:order-2">
        <Button
          className="w-12 h-9 hidden sm:inline"
          color="gray"
          pill
          onClick={themeHandler}
        >
          {theme == "light" ? <FaMoon /> : <FaSun />}
        </Button>
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            label={<Avatar rounded img={currentUser?.profilePicture} />}
            inline
          >
            <Dropdown.Header>
              <span className="block text-sm">@{currentUser.userName}</span>
              <span className="block text-sm truncate">
                {currentUser.email}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Dashboard</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => signOutAccountHandler()}>
              Sign-Out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to={"/sign-in"}>
            <Button gradientDuoTone="purpleToBlue" outline>
              Sign In
            </Button>
          </Link>
        )}

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
