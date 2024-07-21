import { Alert, Button, Modal, Spinner, TextInput } from "flowbite-react";
import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteAccountStart,
  deleteAccountSuccess,
  deleteAccountFailure,
  signOut,
} from "../redux/user/userSlice";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state?.user);

  const [imageObject, setImageObject] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [formDataSubmission, setFormDataSubmission] = useState(null);
  const [formDataError, setFormDataError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accountDeleteLoading, setAccountDeleteLoading] = useState(false);

  console.log(formData);
  const imageRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    let img = e.target.files[0];
    if (img) {
      setImageObject(img);
    }
  };

  useEffect(() => {
    if (imageObject) {
      uploadImage();
    }
  }, [imageObject]);

  const uploadImage = async () => {
    // SETTING FIREBASE STORAGE RULES FOR IMAGES ======
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write: if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }

    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageObject.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageObject);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        // Handle unsuccessful uploads
        setImageFileUploadError(
          "Error while uploading image (Exceed the size limit of 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageObject(null);
        setImageUrl(null);
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          setImageFileUploadError(null);
          setFormData((prev) => ({ ...prev, profilePicture: downloadURL }));
        });
      }
    );
  };

  const inputChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    if (Object.keys(formData)?.length === 0) {
      return;
    } else {
      try {
        dispatch(updateStart());
        setLoading(true);
        setFormDataError(null);
        setFormDataSubmission(null);
        let res = await fetch(`/api/user/update/${currentUser._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
          body: JSON.stringify(formData),
        });
        let data = await res.json();
        if (!res.ok) {
          dispatch(updateFailure(data.message));
          setFormDataSubmission(null);
          setFormDataError(data.message);
          setLoading(false);
          return;
        } else {
          dispatch(updateSuccess(data));
          setFormDataSubmission("User updated successfully!");
          setFormDataError(null);
          setLoading(false);
        }
      } catch (error) {
        dispatch(updateFailure(error));
        setFormDataSubmission(null);
        setFormDataError(error);
        setLoading(false);
      }
    }
  };

  const deleteAccountHandler = async () => {
    try {
      setAccountDeleteLoading(true);
      dispatch(deleteAccountStart());
      let res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        withCredentials: true,
      });
      let data = await res.json();
      if (!res.ok) {
        dispatch(deleteAccountFailure(data.message));
        setAccountDeleteLoading(false);
        setShowModal(true);
        return;
      } else {
        dispatch(deleteAccountSuccess());
        setAccountDeleteLoading(true);
        setShowModal(false);
        return;
      }
    } catch (error) {
      setShowModal(false);
    }
  };

  const signOutAccountHandler = async () => {
    try {
      let res = await fetch("/api/user/signout", {
        method: "POST",
      });
      let data = await res.json();
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mx-auto w-full px-3 max-w-lg">
      <h1 className="text-center my-8 text-3xl font-semibold">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={formSubmitHandler}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={imageRef}
          hidden
        />
        <div
          className="w-20 h-20 self-center cursor-pointer shadow-md rounded-full relative"
          onClick={() => imageRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              strokeWidth={5}
              className="absolute top-0 left-0"
              value={imageFileUploadProgress}
              text={`${imageFileUploadProgress}%`}
              styles={buildStyles({
                textSize: "16px",
                pathColor: `rgba(62, 152, 199, ${
                  imageFileUploadProgress / 100
                })`,
              })}
            />
          )}

          <img
            src={imageUrl || currentUser?.profilePicture}
            alt="user"
            className={`rounded-full h-full w-full object-cover border-4 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color={"failure"}>{imageFileUploadError}</Alert>
        )}
        <TextInput
          id="userName"
          type="text"
          placeholder="username"
          defaultValue={currentUser?.userName}
          onChange={inputChangeHandler}
        />
        <TextInput
          id="email"
          type="email"
          placeholder="email"
          defaultValue={currentUser?.email}
          onChange={inputChangeHandler}
        />
        <TextInput
          id="password"
          type="password"
          placeholder="Password"
          onChange={inputChangeHandler}
        />
        <Button type="submit" gradientDuoTone={"purpleToPink"} outline>
          {loading ? (
            <>
              <Spinner size="sm" />
              <span className="pl-2">Loading.....</span>
            </>
          ) : (
            <span>Update</span>
          )}
        </Button>
        {currentUser?.isAdmin && (
          <Link to={"/create-post"}>
            <Button
              type="button"
              gradientDuoTone={"purpleToPink"}
              className="w-full"
            >
              Create Post
            </Button>
          </Link>
        )}
      </form>
      {formDataSubmission && (
        <Alert className="mt-3" color={"success"}>
          {formDataSubmission}
        </Alert>
      )}
      {formDataError && (
        <Alert className="mt-3" color={"failure"}>
          {formDataError}
        </Alert>
      )}
      <div className="text-red-500 flex justify-between my-2 font-semibold dark:font-normal">
        <span className="cursor-pointer" onClick={() => setShowModal(true)}>
          Delete Account
        </span>
        <span
          className="cursor-pointer"
          onClick={() => signOutAccountHandler()}
        >
          Sign Out
        </span>
      </div>
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
                Are you sure you want to delete this account?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={() => deleteAccountHandler()}>
                  {accountDeleteLoading ? (
                    <>
                      <Spinner size="sm" />
                      <span className='ml-2'>Loading...</span>
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

export default DashProfile;
