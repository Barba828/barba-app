/**
 * @refer https://github.com/GoogleChromeLabs/browser-fs-access#opening-files
 */
import { fileOpen, fileSave } from "browser-fs-access";
import type { FileWithHandle } from "browser-fs-access";
import { useCallback, useEffect, useRef, useState } from "react";

type UploaderOptions = {
  [x in string]: string;
};

const uploaderOptions: UploaderOptions = {
  accept: "image/*",
};

/**
 * 基于 input[type=file] 实现上传组件
 * @param options
 * @returns
 */
export const useUploader = (options: UploaderOptions = uploaderOptions) => {
  const [blob, setBlob] = useState<FileWithHandle>();
  const [src, setSrc] = useState<string>("");
  const input = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    input.current = document.createElement("input");
    Object.keys(options).forEach((key) => {
      if (input.current) {
        (input.current as any)[key] = options[key];
      }
    });
    input.current.type = "file";
    input.current.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;

      if (files && files.length) {
        const blob = files[0];
        const localUrl = URL.createObjectURL(blob); // 转成 Blod url地址
        setSrc(localUrl);
        setBlob(files[0]);
      }
    };
    return () => {
      input.current = null;
    };
  });

  const onOpenFile = useCallback(async () => {
    try {
      input.current?.click();
    } catch (_e) {}
  }, []);

  return { blob, src, onOpenFile };
};

type FileUploaderOptions = GetType<typeof fileOpen>;

const imageOptions = {
  mimeTypes: ["image/*"],
};

/**
 * 基于 GoogleChromeLabs/browser-fs-access 的API式文件读写
 * @param options
 * @returns
 */
export const useFileUploader = (
  options: FileUploaderOptions = imageOptions
) => {
  const [blob, setBlob] = useState<FileWithHandle>();
  const [src, setSrc] = useState<string>("");

  const onOpenFile = useCallback(async () => {
    try {
      const blob = (await fileOpen({
        ...options,
        multiple: false,
      })) as FileWithHandle;

      if (blob) {
        const localUrl = URL.createObjectURL(blob); // 转成 Blod url地址
        setSrc(localUrl);
        setBlob(blob);
      }
    } catch (_e) {}
  }, [options]);

  const onSaveFile = useCallback(async () => {
    if (!blob) {
      return;
    }
    await fileSave(blob, {
      fileName: blob?.name,
      extensions: [".png"],
    });
  }, [blob]);

  return { blob, src, onOpenFile, onSaveFile };
};
