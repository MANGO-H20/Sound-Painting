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
  // Data from file
  const [chromaVals, setchromaVals] = useState([]);
  const [mfccVals, setmfccVals] = useState([]);
  const [centriodVals, setcentriodVals] = useState([]);
  const [timeVals, settimeVals] = useState([]);

  async function upload() {
    if (!soundFile) return;
    setUploadStatus("uploading");

    const form = new FormData();
    form.append("file", soundFile);

    try {
      let res = await api.post("/upload_sound", form);

      // Chroma shape = split in buckets = keys 12, has each value at each frame for that bucket
      // chorma[bucket][frame]
      // MFCC shape = split in buckets = coeffiniencts 20, has each value at each frame for that bucket
      // MFCC[coeffinienct][frame]
      // Centriod shape = all the centriod values at each frame
      // centriod[centriod_val] for each frame
      // Time list of time values that each one has been recorded at

      setchromaVals(res.data.Chroma);
      setcentriodVals(res.data.Centriod);
      setmfccVals(res.data.MFCC);
      settimeVals(res.data.Time);
      //TODO: make render for particles pass in values and sync with time
      setUploadStatus("success");
    } catch (error) {
      console.error(error);
      setUploadStatus("failed");
    }
  }
  const assignCustomColoursChromaVals = (chromaVals) => {};
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
