"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useUploadThing } from "~/utils/uploadthing";
import { toast } from "sonner";

// inferred input off useUploadThing
type Input = Parameters<typeof useUploadThing>;

type CustomData = {
  evaluationId?: number;
  description?: string;
};

const useUploadThingInputProps = (
  endpoint: Input[0],
  options: Input[1],
  customData?: CustomData,
) => {
  const $ut = useUploadThing(endpoint, options);
  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    const result = await $ut.startUpload(selectedFiles, {
      ...customData,
      evaluationId: customData?.evaluationId?.toString(),
    });
    console.log("uploaded files", result);
  };
  return {
    inputProps: {
      onChange,
      multiple: true,
      accept: "image/*",
    },
    isUploading: $ut.isUploading,
  };
};

function UploadSVG(): React.ReactElement {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
      />
    </svg>
  );
}

function LoadingSpinnerSVG(): React.ReactElement {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
    >
      <path
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
        opacity=".25"
      />
      <path
        d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
        className="spinner_ajPY"
      />
    </svg>
  );
}

interface SimpleUploadButtonProps {
  evaluationId?: number;
  description?: string;
}

export function SimpleUploadButton({
  evaluationId,
  description,
}: SimpleUploadButtonProps): React.ReactElement {
  const router = useRouter();
  const { inputProps } = useUploadThingInputProps(
    "imageUploader",
    {
      onUploadBegin() {
        toast(
          <div className="flex items-center gap-2 text-white">
            <LoadingSpinnerSVG /> <span className="text-lg">Uploading...</span>
          </div>,
          {
            duration: 5000,
            id: "uploading-toast",
          },
        );
      },
      onUploadError(err) {
        toast.dismiss("uploading-toast");
        toast.error("Upload failed. Please try again.");
      },
      onClientUploadComplete(res) {
        toast.dismiss("uploading-toast");
        toast("Upload complete!");
        router.refresh();
      },
    },
    { evaluationId, description },
  );

  return (
    <div>
      <label htmlFor="upload-button" className="cursor-pointer">
        <UploadSVG />
      </label>
      <input
        id="upload-button"
        type="file"
        className="sr-only"
        {...inputProps}
      />
    </div>
  );
}
