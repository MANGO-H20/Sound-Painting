import { useState } from "react";

import axios from "axios";

const config = {
  baseURL: process.env.REACT_APP_LOCAL_API,
  headers: {
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Origin": "*",
  },
};
const api = axios.create(config);

export default function FileUpload() {
  const [uploadStatus, setUploadStatus] = useState(null);
  const [soundFile, setSoundFile] = useState(null);

  async function upload(e) {
    if (!soundFile) return;
    setUploadStatus("uploading");

    const form = new FormData();
    form.append("file", soundFile);

    try {
      let res = await api.post("/upload_sound", form);
      console.log(res.data.Chroma);
      console.log(res.data.Time);
      setUploadStatus("success");
    } catch (error) {
      console.error(error);
      setUploadStatus("failed");
    }
  }
  function handleFileChange(e) {
    if (e.target.files) {
      setSoundFile(e.target.files[0]);
    }
  }
  return (
    <>
      <button type="upload" onClick={upload}>
        Upload
      </button>
      <input type="file" name="sound_file" onChange={handleFileChange} />
    </>
  );
}
