import { Button, FileInput, Select, TextInput } from "flowbite-react";
import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const CreatePost = () => {
  return (
    <div className="w-full min-h-screen">
      <h1 className="text-center my-4 text-3xl font-semibold">Create Post</h1>
      <form className="w-full md:max-w-lg mx-auto my-4 px-2">
        <TextInput type="text" placeholder="Title" className="my-4" />
        <Select className="my-4">
          <option selected>Select a category</option>
          <option value="JavaScript">JavaScript</option>
          <option value="React js">React js</option>
          <option value="Next js">Next js</option>
        </Select>
        <div className="my-4 px-2 py-4 flex justify-between items-center gap-2 border-dashed border-2 border-teal-500">
          <FileInput className="w-4/6" accept="image/*" />
          <Button className="w-2/6" gradientDuoTone={"purpleToPink"} outline>
            Upload Image
          </Button>
        </div>
        <ReactQuill className="w-full my-4 h-44 mb-14" required placeholder='Type your post here..' />
        <Button
          type="submit"
          className="w-full my-4"
          gradientDuoTone={"purpleToPink"}
        >
          Publish
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
