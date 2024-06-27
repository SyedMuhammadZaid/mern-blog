import { Alert, Button, TextInput } from "flowbite-react";
import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state?.user);

  const [imageObject, setImageObject] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const imageRef = useRef();

  console.log(imageFileUploadProgress, imageFileUploadError);

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
        setImageFileUploadError("Error while uploading image (Exceed the size limit of 2MB)");
        setImageFileUploadProgress(null)
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageUrl(downloadURL);
          setImageFileUploadError(null);
        });
      }
    );
  };

  return (
    <div className="mx-auto w-full px-3 max-w-lg">
      <h1 className="text-center my-8 text-3xl font-semibold">Profile</h1>
      <form className="flex flex-col gap-4">
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
                textSize:'16px',
                pathColor: `rgba(62, 152, 199, ${imageFileUploadProgress / 100})`
              })}
            />
          )}

          <img
            src={imageUrl || currentUser?.profilePicture}
            alt="user"
            className={`rounded-full h-full w-full object-cover border-4 border-[lightgray] ${imageFileUploadProgress && imageFileUploadProgress < 100 && 'opacity-60'}`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color={"failure"}>{imageFileUploadError}</Alert>
        )}
        <TextInput
          id="username"
          type="text"
          placeholder="username"
          defaultValue={currentUser?.userName}
        />
        <TextInput
          id="email"
          type="email"
          placeholder="email"
          defaultValue={currentUser?.email}
        />
        <TextInput id="password" type="password" placeholder="Password" />
        <Button type="submit" gradientDuoTone={"purpleToPink"} outline>
          Update
        </Button>
      </form>
      <div className="text-red-500 flex justify-between my-2 font-semibold dark:font-normal">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default DashProfile;
