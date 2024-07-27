import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import PostCard from "../components/postCards";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const fetchPosts = async () => {
    try {
      let res = await fetch(`/api/post/get?limit=9&order=desc`, {
        withCredentials: true,
      });
      let data = await res.json();
      setPosts(data?.posts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="w-full py-4 min-h-screen px-2">
      <div className="max-w-6xl w-full mx-auto h-80 flex items-start flex-col justify-center px-2">
        <p className="text-3xl md:text-6xl font-bold mb-4">
          Welcome to my Blog
        </p>
        <p className="text-sm mb-3">
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        <Link
          className="hover:underline font-bold text-sm text-teal-500"
          to={"/search"}
        >
          View all posts
        </Link>
      </div>

      <div className="bg-[#FEF3C7] p-3 my-6">
        <CallToAction />
      </div>

      <div className="max-w-6xl w-full mx-auto flex flex-col">
        <h2 className="text-center font-semibold text-2xl">Recent Posts</h2>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto">
          {posts &&
            posts.map((post, index) => {
              return <PostCard post={post} key={index} />;
            })}
        </div>
        {posts && (
          <Link to={'/search'}>
            <p className="text-center mt-6 text-teal-500">View All Posts</p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;
