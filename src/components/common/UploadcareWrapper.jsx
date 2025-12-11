import React from "react";
import { FileUploaderRegular } from "@uploadcare/react-uploader";
import "@uploadcare/react-uploader/core.css";
import { UPLOADCARE_PUB_KEY } from "@/lib/uploadcare";

const UploadcareWrapper = ({ onUploadSuccess }) => {
  return (
    <FileUploaderRegular
      pubkey={UPLOADCARE_PUB_KEY}
      classNameUploader="uc-light uc-purple"
      sourceList="local, camera, gdrive"
      filesViewMode="grid"
      onFileUploadSuccess={onUploadSuccess}
    />
  );
};

export default UploadcareWrapper;
