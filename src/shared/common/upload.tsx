import Upload, { UploadChangeParam } from "antd/lib/upload";
import message from "antd/lib/message";
import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import React, { useState } from "react";

function getBase64(img: Blob | File, callback: (result: string) => void) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
}

function beforeUpload(file: File) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}

export const Avatar: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | ArrayBuffer | null>("");

  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as Blob, (imgUrl: string): void => {
        setImageUrl(imgUrl);
        setLoading(false);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      action="https://beancountstore.blob.core.windows.net/beancountstore/test?sv=2020-02-10&st=2020-12-22T09%3A00%3A14Z&se=2020-12-23T09%3A00%3A14Z&sr=c&sp=rcw&sig=gbVBCe1byXFrkyIFJFfBOFYxXU4Umggxr9%2Bfai%2BPOzc%3D"
      beforeUpload={beforeUpload}
      onChange={handleChange}
    >
      {imageUrl ? (
        <img src={String(imageUrl)} alt="avatar" style={{ width: "100%" }} />
      ) : (
        uploadButton
      )}
    </Upload>
  );
};
