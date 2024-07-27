import React, { useEffect, useState } from "react";
import { Avatar, Button, Modal, Spinner, Table } from "flowbite-react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { useNavigate, Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";

const DashComments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [accountDeleteLoading, setAccountDeleteLoading] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        let res = await fetch(`/api/comment/get`, {
          method: "GET",
          withCredentials: true,
        });
        let data = await res.json();
        setUsers(data?.comments);
        if (data?.comments?.length < 9) {
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

  const showMoreHandler = async () => {
    try {
      let startIndex = users?.length;
      let res = await fetch(`/api/comment/get?startIndex=${startIndex}`, {
        withCredentials: true,
      });
      let data = await res.json();
      if (res?.status == 200) {
        setUsers((prev) => [...prev, ...data.comments]);
        if (data?.comments?.length < 9) {
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
        `/api/comment/delete/${userIdToDelete}`,
        { method: "DELETE", withCredentials: true }
      );
      if (res.status !== 200) {
        console.log(res.message);
      } else {
        let arr = users.filter((user) => {
          return user._id !== userIdToDelete;
        });
        setAccountDeleteLoading(false);
        setShowModal(false);
        setUsers(arr);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="overflow-x-auto w-full px-1 md:px-4 my-4">
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Comment Content</Table.HeadCell>
          <Table.HeadCell>Number of likes</Table.HeadCell>
          <Table.HeadCell>Post id</Table.HeadCell>
          <Table.HeadCell>User id</Table.HeadCell>
          <Table.HeadCell>Delete</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {currentUser.isAdmin && users?.length > 0 ? (
            <>
              {users.map((user) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 break-all">
                    <Table.Cell>
                        {user.content}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                      {user?.numberOfLikes}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                      {user?.postId}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                      {user?.userId}
                    </Table.Cell>
                    <Table.Cell
                      className=" text-red-500 font-semibold cursor-pointer"
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
                      }}
                    >
                      Delete
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </>
          ) : (
            <p>No Comments Yet!</p>
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
                Are you sure you want to delete this comment?
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

export default DashComments;
