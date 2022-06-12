/**
 * @refer https://github.com/GoogleChromeLabs/browser-fs-access#opening-files
 */
import { fileOpen, fileSave } from "browser-fs-access";
import type { FileWithHandle } from "browser-fs-access";
import { useCallback, useState } from "react";

type StateType = GetType<typeof fileOpen>;

const imageOptions = {
  mimeTypes: ["image/*"],
};

export const useUploader = (options: StateType = imageOptions) => {
  const [blob, setBlob] = useState<FileWithHandle>();
  const [src, setSrc] = useState<string>("");

  const onOpenFile = useCallback(async () => {
    const blob = (await fileOpen({
      ...options,
      multiple: false,
    })) as FileWithHandle;

    if (blob) {
      const localUrl = URL.createObjectURL(blob); // 转成 Blod url地址
      setSrc(localUrl);
      setBlob(blob);
    }
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
