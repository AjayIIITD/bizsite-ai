import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadButton, UploadDropzone } from "@uploadthing/react";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async () => {
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
export { UploadButton, UploadDropzone };
