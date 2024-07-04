import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {useNavigate} from 'react-router-dom'

const CreatePost = () => {
  const [imageObject, setImageObject] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});
  const [formDataError, setFormDataError] = useState(null);
  const navigate = useNavigate()

  const uploadImageHandler = async () => {
    if (!imageObject) {
      return setImageUploadError("Choose Image to upload");
    } else {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + imageObject.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, imageObject);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError("Failed to upload Image");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFormData({ ...formData, image: downloadURL });
            setImageUploadProgress(null);
            setImageUploadError(null);
          });
        }
      );
    }
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let res = await fetch("/api/post/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        body: JSON.stringify(formData),
      });
      let data = await res.json();
      if (!res.ok) {
        console.log(data);
        setFormDataError(data.message);
      } else {
        navigate(`/post/${data?.newPost?.slug}`)
      }
    } catch (error) {
      setFormDataError("Form is not saved due to some Error");
    }
  };

  return (
    <div className="w-full min-h-screen">
      <h1 className="text-center my-4 text-3xl font-semibold">Create Post</h1>
      <form
        className="w-full md:max-w-lg mx-auto my-4 px-2"
        onSubmit={formSubmitHandler}
      >
        <TextInput
          type="text"
          placeholder="Title"
          className="my-4"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <Select
          className="my-4"
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
        >
          <option selected>Select a category</option>
          <option value="JavaScript">JavaScript</option>
          <option value="React js">React js</option>
          <option value="Next js">Next js</option>
        </Select>
        <div className="my-4 px-2 py-4 flex justify-between items-center gap-2 border-dashed border-2 border-teal-500">
          <FileInput
            className="w-4/6"
            accept="image/*"
            onChange={(e) => setImageObject(e.target.files[0])}
          />
          {imageUploadProgress ? (
            <CircularProgressbar
              className={"w-14 h-14"}
              strokeWidth={5}
              value={imageUploadProgress}
              text={`${imageUploadProgress} %`}
              styles={buildStyles({
                textSize: "16px",
                pathColor: `rgba(62, 152, 199, ${imageUploadProgress / 100})`,
              })}
            />
          ) : (
            <Button
              className="w-2/6"
              gradientDuoTone={"purpleToPink"}
              outline
              onClick={uploadImageHandler}
            >
              Upload Image
            </Button>
          )}
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData?.image && (
          <img src={formData?.image} className="w-full h-full object-cover" />
        )}
        <ReactQuill
          className="w-full my-4 h-44 mb-14"
          required
          placeholder="Type your post here.."
          onChange={(value) => setFormData({ ...formData, content: value })}
        />
        <Button
          type="submit"
          className="w-full my-4"
          gradientDuoTone={"purpleToPink"}
        >
          Publish
        </Button>
        {formDataError && (
          <Alert color={"failure"} className="my-4 px-2">
            {formDataError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
