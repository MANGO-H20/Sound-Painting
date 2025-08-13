import { useState } from "react";

import axios from "axios";

const config = {
  baseURL: process.env.REACT_APP_LOCAL_API,
  headers: {
    "Content-Type": "multipart/form-data",
  },
};
const api = axios.create(config);

export default function FileUpload() {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [soundFile, setSoundFile] = (useState < File) | (null > null);
  async function upload() {
    if (!soundFile) return;
    setUploadStatus("uploading");

    const form = new FormData();
    form.append("file", soundFile);

    try {
      await api.post("/upload_sound_form", form);
    } catch (error) {
      console.error(error);
    }
  }
  function handleFileChange(e) {
    if (e.target.file) {
      setSoundFile(e.target.file[0]);
    }
  }
  return (
    <form className="upload_form ">
      <input type="file" name="sound_file" onChange={handleFileChange} />
      <button type="upload" onClick={upload}>
        Upload
      </button>
    </form>
  );
}
