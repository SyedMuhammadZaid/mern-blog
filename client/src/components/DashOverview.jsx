import React, { useState } from "react";
import { PiUsersThree } from "react-icons/pi";
import { FaArrowTrendUp } from "react-icons/fa6";
import { IoMdText } from "react-icons/io";
import { IoDocumentText } from "react-icons/io5";
import { Button } from "flowbite-react";
import { Table } from "flowbite-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const DashOverview = () => {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [overview, setOverview] = useState({
    post: {
      postCount: 0,
      lastMonthPostCount: 0,
    },
    comment: {
      commentCount: 0,
      lastMonthCommentCount: 0,
    },
    user: {
      userCount: 0,
      lastMonthUserCount: 0,
    },
  });

  const { currentUser } = useSelector((state) => state.user);

  const fetchUsers = async () => {
    try {
      let res = await fetch(`/api/user/getUsers?limit=5&order=desc`, {
        method: "GET",
        withCredentials: true,
      });
      let data = await res.json();
      setUsers(data?.users);
      setOverview((prev) => ({
        ...prev,
        user: {
          userCount: data?.totalUsers,
          lastMonthUserCount: data?.lastMonthUsers,
        },
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPosts = async () => {
    try {
      let res = await fetch(`/api/post/get?limit=5&order=desc`, {
        withCredentials: true,
      });
      let data = await res.json();
      setPosts(data?.posts);
      setOverview((prev) => ({
        ...prev,
        post: {
          postCount: data?.totalPosts,
          lastMonthPostCount: data?.lastsMonthPosts,
        },
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComments = async () => {
    try {
      let res = await fetch(`/api/comment/get?limit=5&order=desc`, {
        method: "GET",
        withCredentials: true,
      });
      let data = await res.json();
      setComments(data?.comments);
      setOverview((prev) => ({
        ...prev,
        comment: {
          commentCount: data?.totalDocuments,
          lastMonthCommentCount: data?.lastsMonthComments,
        },
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const functionCaller = async () => {
    await Promise.all([fetchUsers(), fetchPosts(), fetchComments()]);
  };

  useEffect(() => {
    if (currentUser?.isAdmin) {
      functionCaller();
    }
  }, []);

  return (
    <div className="w-full px-2 py-2 max-w-4xl mx-auto my-4 flex flex-col gap-7">
      <div className="flex gap-3 flex-wrap">
        <div
          className="flex-1 flex flex-col gap-0 py-3 px-5 rounded"
          style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
        >
          <div className="flex items-start justify-between">
            <p>TOTAL USERS</p>
            <div className="border w-9 px-1 h-9 flex items-center justify-center rounded-full bg-teal-700">
              <PiUsersThree size={25} color="white" />
            </div>
          </div>
          <p className="font-bold text-lg mt-[-10px]">
            {overview.user.userCount}
          </p>
          <p className="">
            <span>
              <FaArrowTrendUp className="inline mr-2" />
              {overview.user.lastMonthUserCount}
            </span>{" "}
            Last Month
          </p>
        </div>
        <div
          className="flex-1 flex flex-col gap-0 py-3 px-5 rounded"
          style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
        >
          <div className="flex items-start justify-between">
            <p>TOTAL COMMENTS</p>
            <div className="border w-9 px-1 h-9 flex items-center justify-center rounded-full bg-purple-700">
              <IoMdText size={25} color="white" />
            </div>
          </div>
          <p className="font-bold text-lg mt-[-10px]">
            {overview.comment.commentCount}
          </p>
          <p className="">
            <span>
              <FaArrowTrendUp className="inline mr-2" />
              {overview.comment.lastMonthCommentCount}
            </span>
            Last Month
          </p>
        </div>
        <div
          className="flex-1 flex flex-col gap-0 py-3 px-5 rounded"
          style={{ boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px" }}
        >
          <div className="flex items-start justify-between">
            <p>TOTAL POSTS</p>
            <div className="border w-9 px-1 h-9 flex items-center justify-center rounded-full bg-green-700">
              <IoDocumentText size={25} color="white" />
            </div>
          </div>
          <p className="font-bold text-lg mt-[-10px]">
            {overview.post.postCount}
          </p>
          <p className="">
            <span>
              <FaArrowTrendUp className="inline mr-2" />
              {overview.post.lastMonthPostCount}
            </span>{" "}
            Last Month
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto flex flex-col w-full items-center justify-center gap-2 flex-wrap">
        <div className="grid md:grid-cols-[1fr,1.5fr] grid-cols-1 gap-4 m-2 w-full">
          <div
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
            }}
            className="flex flex-col gap-4 px-2 py-2 dark:border dark:border-gray-700 rounded"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-black dark:text-gray-300">Recent users</h2>
              <Button gradientDuoTone={"purpleToPink"} outline>
              <Link to={'/dashboard?tab=users'}>See all</Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <Table.Head>
                  <Table.HeadCell>User Image</Table.HeadCell>
                  <Table.HeadCell>User Name</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {users &&
                    users.map((user) => {
                      return (
                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                          <Table.Cell>
                            <img
                              src={
                                user?.profilePicture ? user?.profilePicture : ""
                              }
                              className="w-12 h-10 object-cover object-center bg-gray-500"
                              style={{ borderRadius: "50%" }}
                            />
                          </Table.Cell>
                          <Table.Cell>
                            {user?.userName ? user?.userName : "-"}
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                </Table.Body>
              </Table>
            </div>
          </div>
          <div
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
            }}
            className="flex flex-col gap-4 px-2 py-2 dark:border dark:border-gray-700 rounded"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-black dark:text-gray-300">Recent comments</h2>
              <Button gradientDuoTone={"purpleToPink"} outline>
                <Link to={'/dashboard?tab=comments'}>See all</Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <Table.Head>
                  <Table.HeadCell>Comment Content</Table.HeadCell>
                  <Table.HeadCell>likes</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {comments &&
                    comments.map((comment) => {
                      return (
                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                          <Table.Cell>
                            <p className="break-all">{comment?.content}</p>
                          </Table.Cell>
                          <Table.Cell>{comment?.numberOfLikes}</Table.Cell>
                        </Table.Row>
                      );
                    })}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>

        <div className="max-w-2xl w-full">
          <div
            style={{
              boxShadow:
                "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
            }}
            className="flex flex-col gap-4 px-2 py-2 dark:border dark:border-gray-700 rounded"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-black dark:text-gray-300">Recent posts</h2>
              <Button gradientDuoTone={"purpleToPink"} outline>
              <Link to={'/dashboard?tab=posts'}>See all</Link>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <Table.Head>
                  <Table.HeadCell>Post image</Table.HeadCell>
                  <Table.HeadCell>Post title</Table.HeadCell>
                  <Table.HeadCell>Category</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {posts &&
                    posts.map((post) => {
                      return (
                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                          <Table.Cell>
                            <img src={post.image} className="h-8 w-13" />
                          </Table.Cell>
                          <Table.Cell>
                            <p className="break-all">{post?.title}</p>
                          </Table.Cell>
                          <Table.Cell>
                            <p className="break-all">{post?.category}</p>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                </Table.Body>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashOverview;
