import { Button, ButtonGroup, Spinner, Textarea } from "flowbite-react";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import CallToAction from "../components/CallToAction";
import { useSelector } from "react-redux";
import { AiFillLike } from "react-icons/ai";
import CommentSection from "../components/CommentSection";

const SeenPost = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState([]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      let res = await fetch(`/api/post/get?slug=${postSlug}`, {
        withCredentials: true,
      });
      console.log(res);
      let data = await res.json();
      console.log(data)
      if (!res.ok) {
        setLoading(false);
        setError(true);
      } else {
        setLoading(false);
        setError(false);
        setPost(data?.posts[0]);
      }
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [postSlug]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size={"xl"} />
      </div>
    );

  return (
    <main className="p-3 flex flex-col max-w-5xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-4 px-4 text-center font-serif lg:text-4xl mx-auto">
        {post && post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center my-2"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.image}
        alt={post && post.title}
        className="w-full object-contain mt-2 max-h-[600px]"
      />
      <div className="flex items-center flex-wrap justify-between p-2 text-gray-500 text-xs border-b ">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && (post?.content?.length / 1000).toFixed(0) + "min read"}
        </span>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: post && post.content }}
        className="p-3 max-w-2xl mx-auto w-full post-content"
      ></div>
      <div className="max-w-4xl w-full mx-auto">
        <CallToAction />
      </div>

      <div className="my-4 max-w-xl mx-auto w-full">
        <CommentSection postId={post && post._id} />
      </div>
    </main>
  );
};

export default SeenPost;
