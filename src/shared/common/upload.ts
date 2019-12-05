// @flow
// $FlowFixMe
import { message } from "antd";
import axios from "axios";
// @ts-ignore
import window from "global/window";
import { t } from "onefx/lib/iso-i18n";
import sha1 from "sha1";

const uploadConfig = {
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
  // tslint:disable-next-line:no-non-null-assertion
  api_secret: process.env.CLOUDINARY_API_SECRET!
};

export const upload = (
  file: any,
  title: any,
  publicId: string,
  sizeLimit: any = 500
) => {
  const fileSizeLimit = file.size / 1024 < sizeLimit;
  if (!fileSizeLimit) {
    message.error(`${t("upload.limit")} ${sizeLimit}KB!`);
    return Promise.reject();
  }
  const formData = new window.FormData();
  const timestamp = Math.floor(new Date().getTime() / 1000);
  const tags = title ? `myphotoalbum,${title}` : "myphotoalbum";
  const overwrite = "true";
  const context = title ? `photo\=${title}` : "";
  formData.append("file", file);
  formData.append("api_key", uploadConfig.api_key);

  formData.append("timestamp", timestamp);
  formData.append("public_id", publicId);
  formData.append("overwrite", overwrite);
  formData.append("tags", tags);
  formData.append("context", context);

  const signature = createSignature({
    timestamp,
    tags,
    overwrite,
    context,
    public_id: publicId
  });
  formData.append("signature", signature);

  return axios.post(uploadConfig.url, formData).then(({ data }) => data);
};

function createSignature(parameter: object): string {
  const origin = Object.keys(parameter)
    .sort()
    .reverse()
    .reduce(
      (sum: string, key: string, index: number, array: Array<string>): string =>
        `${index === array.length - 1 ? "" : "&"}${key}=${
          // @ts-ignore
          parameter[key]
        }${sum}`,
      uploadConfig.api_secret
    );
  return sha1(origin);
}
