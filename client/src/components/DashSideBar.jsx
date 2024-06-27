import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { HiUser, HiArrowRight } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

const DashSideBar = () => {

  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <Sidebar className="w-full">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              active={tab == "profile"}
              label={"User"}
              labelColor={"dark"}
              icon={HiUser}
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Sidebar.Item icon={HiArrowRight}>Sign Out</Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSideBar;
