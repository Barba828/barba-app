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
 * @param options 上传组件的配置 {accept: "image/*"}
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

  const openFile = useCallback(async () => {
    try {
      input.current?.click();
    } catch (_e) {}
  }, []);

  return { blob, src, openFile };
};

/**
 * 文件下载
 * @param canvas
 * @param blob 下载blob对象
 * @param extensions 保存文件类型
 * @returns
 */
export const useDownloader = (
  canvas?: HTMLCanvasElement | null,
  blob?: FileWithHandle,
  extensions: string[] = [".png"]
) => {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(`barba_${blob?.name}`);
  }, [blob]);

  const downloadFile = async () => {
    if (!canvas) {
      return;
    }
    canvas.toBlob(async (canvasBlob) => {
      if (!canvasBlob) {
        return;
      }

      await fileSave(canvasBlob, {
        fileName: name,
        extensions: extensions,
      });
    });
  };
  return { name, downloadFile };
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

  const openFile = useCallback(async () => {
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

  return { blob, src, openFile, onSaveFile };
};
