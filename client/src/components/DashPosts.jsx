import React, { useEffect, useState } from "react";
import { Button, Modal, Spinner, Table } from "flowbite-react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { useNavigate, Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [accountDeleteLoading, setAccountDeleteLoading] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let res = await fetch(`/api/post/get?userId=${currentUser._id}`, {
          withCredentials: true,
        });
        let data = await res.json();
        setUserPosts(data?.posts);
        if (data?.posts.length < 9) {
          setShowMore(false);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id]);

  const editHandler = (id) => {
    navigate(`/update-post/${id}`);
  };

  const showMoreHandler = async () => {
    try {
      let startIndex = userPosts.length;
      let res = await fetch(
        `/api/post/get?userId=${currentUser._id}&startIndex=${startIndex}`,
        { withCredentials: true }
      );
      let data = await res.json();
      if (res?.status == 200) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data?.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAccountHandler = async () => {
    setAccountDeleteLoading(true);
    try {
      let res = await fetch(
        `/api/post/delete/${postIdToDelete}/${currentUser._id}`,
        { method: "DELETE", withCredentials: true }
      );
      if(res.status !== 200){
        console.log(res.message)
      }
      else{
        let arr = userPosts.filter((post) => {
          return post._id !== postIdToDelete;
        })
        setAccountDeleteLoading(false);
        setShowModal(false)
        setUserPosts(arr)
      }

    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="overflow-x-auto w-full px-1 md:px-4 my-4">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Date Updated</Table.HeadCell>
          <Table.HeadCell>Post Image</Table.HeadCell>
          <Table.HeadCell>Post Title</Table.HeadCell>
          <Table.HeadCell>Category</Table.HeadCell>
          <Table.HeadCell>
            <span>Edit</span>
          </Table.HeadCell>
          <Table.HeadCell>Delete</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {currentUser.isAdmin && userPosts.length > 0 ? (
            <>
              {userPosts.map((post) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                      {dayjs(post.updatedAt).format("YYYY-MM-DD")}
                    </Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <Table.Cell>
                        <img
                          src={post.image}
                          className="w-20 h-10 object-cover bg-gray-500"
                        />
                      </Table.Cell>
                    </Link>
                    <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                      {post.title}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                      {post.category}
                    </Table.Cell>
                    <Table.Cell
                      className="text-teal-500 cursor-pointer font-semibold"
                      onClick={() => editHandler(post._id)}
                    >
                      Edit
                    </Table.Cell>
                    <Table.Cell
                      className=" text-red-500 font-semibold cursor-pointer"
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                    >
                      Delete
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </>
          ) : (
            <p>No posts posted Yet!</p>
          )}
        </Table.Body>
      </Table>
      {showMore && (
        <button
          className="text-teal-500 self-center w-full my-4"
          onClick={showMoreHandler}
        >
          Show More
        </button>
      )}
      {showModal && (
        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          size="md"
          popup
        >
          <Modal.Header />
          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
              <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                Are you sure you want to delete this post?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={() => deleteAccountHandler()}>
                  {accountDeleteLoading ? (
                    <>
                      <Spinner size="sm" />
                      <span className="ml-2">Loading...</span>
                    </>
                  ) : (
                    <span>Yes, I'm sure</span>
                  )}
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default DashPosts;
