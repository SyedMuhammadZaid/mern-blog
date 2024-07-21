import React, { useEffect, useState } from "react";
import { Avatar, Button, Modal, Spinner, Table } from "flowbite-react";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import { useNavigate, Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import { TiTick } from "react-icons/ti";


const DashUsers = () => {

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
        let res = await fetch(`/api/user/getUsers`, {
          method: 'GET',
          withCredentials: true,
        });
        let data = await res.json();
        setUsers(data?.users);
        if (data?.users?.length < 9) {
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
      let startIndex = users?.length;
      let res = await fetch(
        `/api/user/getUsers?startIndex=${startIndex}`,
        { withCredentials: true }
      );
      let data = await res.json();
      if (res?.status == 200) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data?.users?.length < 9) {
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
        `/api/user/delete/${userIdToDelete}/${currentUser._id}`,
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
          <Table.HeadCell>Date Created</Table.HeadCell>
          <Table.HeadCell>User Image</Table.HeadCell>
          <Table.HeadCell>User Name</Table.HeadCell>
          <Table.HeadCell>Admin</Table.HeadCell>
          <Table.HeadCell>Delete</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {currentUser.isAdmin && users?.length > 0 ? (
            <>
              {users.map((user) => {
                return (
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="whitespace-nowrap text-gray-900 dark:text-white">
                      {dayjs(user.createdAt).format("YYYY-MM-DD")}
                    </Table.Cell>
                      <Table.Cell>
                        <img
                          src={user?.profilePicture}
                          className="w-12 h-12 object-cover object-center bg-gray-500"
                          style={{borderRadius:'50%'}}
                          
                        />
                      </Table.Cell>
                    <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                      {user?.userName}
                    </Table.Cell>
                    <Table.Cell className="whitespace-nowrap  text-gray-900 dark:text-white">
                      {user?.isAdmin ? <TiTick color="green" size={20} /> : <RxCross2 color="black" /> }
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
            <p>No Users Yet!</p>
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
                Are you sure you want to delete this user?
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

export default DashUsers;
