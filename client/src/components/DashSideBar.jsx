import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowRight, HiDocumentText, HiUserGroup } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../redux/user/userSlice";

const DashSideBar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

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

  return (
    <Sidebar className="w-full">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab == "profile"}
              label={currentUser?.isAdmin ? 'Admin' : ' User'}
              labelColor={"dark"}
              icon={HiUser}
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentUser?.isAdmin && (
            <>
            <Link to={"/dashboard?tab=posts"}>
              <Sidebar.Item active={tab == "posts"} icon={HiDocumentText}>
                Posts
              </Sidebar.Item>
            </Link>
            <Link to={"/dashboard?tab=users"}>
              <Sidebar.Item active={tab == "users"} icon={HiUserGroup}>
                Users
              </Sidebar.Item>
            </Link>
            </>
          )}
          <Sidebar.Item icon={HiArrowRight} onClick={signOutAccountHandler}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSideBar;
