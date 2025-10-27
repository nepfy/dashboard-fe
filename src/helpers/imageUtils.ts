// src/helpers/imageUtils.ts

export const getPhotoDimensions = (itemCount: number) => {
  // Desktop/Tablet dimensions
  const desktopDimensions = {
    2: { width: 500, height: 410 },
    3: { width: 430, height: 340 },
    4: { width: 500, height: 410 },
    5: { width: 430, height: 340 },
    6: { width: 430, height: 340 },
  }[itemCount] || { width: 430, height: 340 }; // default

  return {
    desktop: desktopDimensions,
    mobile: { width: 300, height: 435 },
  };
};

export const getAspectRatio = (itemCount: number) => {
  const dimensions = getPhotoDimensions(itemCount);
  // Use desktop dimensions for cropping to match what's displayed in Team component
  return dimensions.desktop.width / dimensions.desktop.height;
};

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

export const getCroppedImg = (
  image: HTMLImageElement,
  crop: { x: number; y: number; width: number; height: number },
  fileName: string
): Promise<File> => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("No 2d context");
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  const pixelRatio = window.devicePixelRatio;

  canvas.width = crop.width * pixelRatio * scaleX;
  canvas.height = crop.height * pixelRatio * scaleY;

  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width * scaleX,
    crop.height * scaleY
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const file = new File([blob], fileName, {
          type: "image/jpeg",
        });
        resolve(file);
      },
      "image/jpeg",
      0.9
    );
  });
};
