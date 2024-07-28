import { Button, Select, TextInput } from "flowbite-react";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../components/postCards";

const Search = () => {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    order: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const urlSearchParams = new URLSearchParams(location.search);
    let searchVal = urlSearchParams.get("searchTerm");
    let sortVal = urlSearchParams.get("order");
    let categoryVal = urlSearchParams.get("category");
    if (searchVal || sortVal || categoryVal) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchVal,
        order: sortVal,
        category: categoryVal,
      });
    }
    const fetchPosts = async () => {
        try {
          setLoading(true);
          let searchParamsStr = urlSearchParams.toString();
          let res = await fetch(`/api/post/get?${searchParamsStr}`);
          if (res.ok) {
            let data = await res.json();
            setPosts(data.posts);
            setLoading(false);
            if (data?.posts?.length === 9) {
              setShowMore(true);
            } else {
              setShowMore(false);
            }
          } else {
            setPosts([]);
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          console.log(error);
        }
      };

      fetchPosts();
  }, [location.search]);

  const onChangeHandler = (e) => {
    if (e.target.id == "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id == "order") {
      let orderVal = e.target.value || "desc";
      setSidebarData({ ...sidebarData, order: orderVal });
    }
    if (e.target.id == "category") {
      let categoryVal =
        e.target.value === "uncategorized" ? "" : e.target.value;
      setSidebarData({ ...sidebarData, category: categoryVal });
    }
  };

  const formHandler = async (e) => {
    e.preventDefault();
    let urlSearchParams = new URLSearchParams(location.search);
    urlSearchParams.set("searchTerm", sidebarData.searchTerm);
    urlSearchParams.set("order", sidebarData.order);
    urlSearchParams.set("category", sidebarData.category);
    let urlStringParams = urlSearchParams.toString();
    navigate(`/search?${urlStringParams}`);
  };

  const showMoreHandler = async () => {
    try {
      let startIndex = posts.length;
      let searchParams = new URLSearchParams(location.search);
      searchParams.set("startIndex", startIndex);
      let searchParamsStr = searchParams.toString();
      let res = await fetch(`/api/post/get?${searchParamsStr}`);
      if (res.ok) {
        let data = await res.json();
        setPosts((prev) => ([...prev, ...data.posts]));
        if (data?.posts?.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b  md:min-h-screen border-gray-500 md:border-r">
        <form className="flex flex-col gap-7" onSubmit={formHandler}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term
            </label>
            <TextInput
              type={"text"}
              value={sidebarData.searchTerm}
              id="searchTerm"
              onChange={onChangeHandler}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort</label>
            <Select
              onChange={onChangeHandler}
              id="order"
              value={sidebarData.order}
            >
              <option value={"desc"}>Latest</option>
              <option value={"asc"}>Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category</label>
            <Select
              onChange={onChangeHandler}
              id="category"
              value={sidebarData.category}
            >
              <option value={"uncategorized"}>Un-Categorized</option>
              <option value="javascript">JavaScript</option>
              <option value="reactjs">React js</option>
              <option value="nextjs">Next js</option>
            </Select>
          </div>
          <Button type="submit" outline gradientDuoTone={"purpleToPink"}>
            Search Filters
          </Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-xl font-semibold p-3 sm:border-b border-gray-400">
          Posts Results:{" "}
        </h1>
        <div className="flex flex-wrap p-3 gap-4">
          {!loading && posts.length === 0 && (
            <p className="font-normal text-lg">No posts found!</p>
          )}
          {loading && (
            <p className="font-normal text-lg text-teal-500">Loading...</p>
          )}
          {!loading &&
            posts &&
            posts.map((post, index) => {
              return <PostCard post={post} key={index} />;
            })}
          {showMore && (
            <p
              onClick={showMoreHandler}
              className="text-center text-teal-500 block w-full cursor-pointer"
            >
              Show More
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
