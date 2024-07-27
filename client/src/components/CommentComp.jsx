import { Button, Textarea } from "flowbite-react";
import moment from "moment/moment";
import React, { useState } from "react";
import { useEffect } from "react";
import { AiFillLike } from "react-icons/ai";
import { useSelector } from "react-redux";

const CommentComp = ({ comment, allComments, setComments }) => {
  const [individualUser, setIndividualUser] = useState(null);
  const [showComment, setShowComment] = useState(false);
  const [content, setContent] = useState("");

  const { currentUser } = useSelector((state) => state?.user);

  useEffect(() => {
    const getUser = async () => {
      try {
        let res = await fetch(`/api/user/getUser/${comment?.userId}`, {
          withCredentials: true,
        });
        let data = await res.json();
        setIndividualUser(data);
        return data;
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [comment]);

  const likeHandler = async (commentId) => {
    try {
      let res = await fetch(`/api/comment//likes/${commentId}`, {
        method: "PUT",
        withCredentials: true,
      });
      let data = await res.json();
      setComments(
        allComments.map((item) => {
          if (item._id == data?.comment._id) {
            return {
              ...item,
              likes: data?.comment.likes,
              numberOfLikes: data?.comment.numberOfLikes,
            };
          } else {
            return item;
          }
        })
      );
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandler = (e) => {
    console.log(e.target.value);
  };

  const editHandler = () => {
    setShowComment(true);
    setContent(comment.content);
  };

  const saveEditCommentHandler = async () => {
    if (showComment && content) {
      let res = await fetch(`/api/comment/edit/${comment._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content,
        }),
      });
      let data = await res.json();
      setShowComment(false);
      if (data) {
        setComments(
          allComments.map((c) => {
            if (c._id == data?._id) {
              return { ...c, content: content };
            }
            return c;
          })
        );
      }
    }
  };

  const deleteHandler = async () => {
    try {
      let res = await fetch(`/api/comment/delete/${comment._id}`, {
        method: "DELETE",
        withCredentials: true,
      });
      if (res.ok) {
        setComments(
          allComments.filter((c) => {
            return c._id !== comment._id;
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    individualUser && (
      <div>
        <div className="flex items-start gap-2 mx-2 mb-4">
          <img
            src={individualUser?.rest && individualUser?.rest?.profilePicture}
            className="w-7 h-7 rounded-full"
          />
          <div className="flex flex-col">
            <div className="flex gap-2 items-center">
              <span className="font-semibold">
                @ {individualUser?.rest && individualUser.rest?.userName}
              </span>
              <span className="text-xs text-gray-500">
                - {moment(comment.createdAt).fromNow()}
              </span>
            </div>
            <>
              {showComment ? (
                <div className="flex flex-col">
                  <Textarea
                    value={content}
                    style={{ color: "black", background: "white" }}
                    onChange={(e) => setContent(e.target.value)}
                  />
                  <div className="self-end flex mt-2 gap-2">
                    <Button
                      className="rounded-md"
                      gradientDuoTone={"purpleToPink"}
                      outline
                      onClick={saveEditCommentHandler}
                    >
                      Save
                    </Button>
                    <Button
                      color={"failure"}
                      className="rounded-md"
                      onClick={() => setShowComment(false)}
                    >
                      Discard
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="dark:text-gray-400 text-gray-600">
                  {comment?.content && comment?.content}
                </p>
              )}
            </>
          </div>
        </div>
        {showComment ? (
          ""
        ) : (
          <div className="flex w-full items-center mb-6 gap-3 pb-4 dark:text-gray-400 text-gray-600 border-b border-b-slate-200 dark:border-b-slate-800">
            <span className="flex items-center cursor-pointer">
              <AiFillLike
                className={`mx-2 ${
                  currentUser &&
                  comment?.likes?.includes(currentUser._id) &&
                  "!text-blue-500"
                }`}
              />
              {comment?.numberOfLikes && comment?.numberOfLikes}{" "}
              <span className="ml-2" onClick={() => likeHandler(comment._id)}>
                Like
              </span>
            </span>
            <span className="cursor-pointer" onClick={() => editHandler()}>
              Edit
            </span>
            <span className="cursor-pointer" onClick={() => deleteHandler()}>
              Delete
            </span>
          </div>
        )}
      </div>
    )
  );
};

export default CommentComp;
