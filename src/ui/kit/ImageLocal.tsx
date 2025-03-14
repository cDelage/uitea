import { useEffect, useRef, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { ImageLocal } from "../../domain/ImageDomain";
import Loader from "./Loader";
import styles from "./ImageLocal.module.css";

function ImageLocalComponent({ srcPath }: { srcPath: string | undefined }) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imageLocal, setImageLocal] = useState<ImageLocal | undefined>(
    undefined
  );
  useEffect(() => {
    const observer = new IntersectionObserver(async (entries) => {
      if (
        entries[0].isIntersecting &&
        srcPath &&
        imageLocal?.path !== srcPath
      ) {
        const image = await invoke<ImageLocal>("encode_image_base64", {
          path: srcPath,
        });
        setImageLocal(image);
      }
    });

    observer.observe(imgRef.current as Element);

    return () => {
      observer.disconnect();
    };
  }, [imageLocal, setImageLocal, srcPath]);

  return (
    <>
      {!imageLocal && <Loader />}
      <img
        ref={imgRef}
        className={styles.imgLocal}
        src={imageLocal?.binary}
      />
    </>
  );
}

export default ImageLocalComponent;
