import { Button, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import CommentComp from "./CommentComp";

const CommentSection = ({ postId }) => {
  const { currentUser } = useSelector((state) => state?.user);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);

  const getComments = async () => {
    let res = await fetch(`/api/comment/get/${postId}`, {
      withCredentials: true,
    });
    let data = await res.json();
    setComments(data?.data);
    console.log(data);
  };

  useEffect(() => {
    getComments();
  }, [postId]);

  const commentHandler = async () => {
    if (comment?.length == 0) return;
    try {
      const formData = {
        content: comment,
        userId: currentUser._id,
        postId: postId,
      };
      const res = await fetch("/api/comment/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        return setError(error?.message);
      }
      getComments()
      setError(null);
    } catch (error) {
      setError(error?.message);
      console.log(error);
    }
    setComment("");
  };

  return currentUser ? (
    <div>
      <div className="flex gap-2 items-center text-xs p-2">
        <span className="text-gray-500">Signed in as:</span>
        <img
          src={currentUser.profilePicture && currentUser.profilePicture}
          className="w-6 h-6 rounded-full"
        />
        <Link to={"/dashboard?tab=profile"}>
          <span className="text-cyan-700 font-semibold cursor-pointer">
            @ {currentUser.email && currentUser.email}
          </span>
        </Link>
      </div>
      <div className="mx-2 p-2 flex flex-col gap-2 border border-teal-500 rounded">
        <Textarea
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          onClick={() => commentHandler()}
          className="self-end"
          gradientDuoTone={"purpleToPink"}
          outline
        >
          Submit
        </Button>
      </div>
      <p className="my-4 md:my-6 mx-2">
        Comments <span className="py-1 px-2 border ml-2">{comments?.length > 0 ? comments?.length : 0}</span>
      </p>
      {comments?.length > 0 ? (
        comments.map((comment) => {
          return <CommentComp comment={comment} allComments={comments} setComments={setComments} />;
        })
      ) : (
        <div className=" w-full text-center mx-auto text-cyan-500">
          <p>No Comments to Show !</p>
        </div>
      )}
    </div>
  ) : (
    <div className="flex items-center gap-2 justify-center dark:text-gray-300">
      You must be signIn to Comment.
      <Link to={"/sign-in"} className="text-cyan-500">
        SignIn
      </Link>
    </div>
  );
};

export default CommentSection;
