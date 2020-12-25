import Upload, { UploadChangeParam } from "antd/lib/upload";
import message from "antd/lib/message";
import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import PlusOutlined from "@ant-design/icons/PlusOutlined";
import React, { useEffect, useState } from "react";
import { RcCustomRequestOptions } from "antd/lib/upload/interface";
import { axiosInstance } from "@/shared/onefx-auth-provider/email-password-identity-provider/view/axios-instance";

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

const prefix = "data:image/png;base64,";

type Props = {
  initialImageUrl: string;
};

export const Avatar: React.FC<Props> = ({ initialImageUrl }) => {
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string>(initialImageUrl);

  useEffect(() => {
    (async () => {
      try {
        if (!imageUrl || imageUrl.startsWith(prefix)) {
          setLoading(false);
          return;
        }
        setLoading(true);
        const resp = await axiosInstance.get(imageUrl, {
          responseType: "arraybuffer",
        });
        const imageBase64 = Buffer.from(resp.data, "binary").toString("base64");
        setImageUrl(`${prefix}${imageBase64}`);
      } catch (_) {
        setImageUrl("");
      }
      setLoading(false);
    })();
  });

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

  let innerTile: React.ReactNode;
  console.log({
    loading,
    imageUrl,
  });
  if (loading) {
    innerTile = (
      <div>
        <LoadingOutlined />
        <div style={{ marginTop: 8 }}>Loading</div>
      </div>
    );
  } else if (!imageUrl) {
    innerTile = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
  } else {
    innerTile = (
      <img src={String(imageUrl)} alt="avatar" style={{ width: "100%" }} />
    );
  }

  return (
    <Upload
      name="avatar"
      listType="picture-card"
      className="avatar-uploader"
      showUploadList={false}
      beforeUpload={beforeUpload}
      customRequest={async (options: RcCustomRequestOptions) => {
        setLoading(true);
        await axiosInstance.put(initialImageUrl, options.file, {
          headers: {
            "x-ms-blob-type": "BlockBlob",
            "Content-Type": options.file.type,
          },
        });
        options.onSuccess({}, options.file);
        setLoading(false);
      }}
      method="PUT"
      onChange={handleChange}
    >
      {innerTile}
    </Upload>
  );
};
