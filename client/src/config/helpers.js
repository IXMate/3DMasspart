// ===============================
// Download canvas as image
// ===============================
export const downloadCanvasToImage = () => {
  const canvas = document.querySelector("canvas");

  if (!canvas) {
    console.error("Canvas not found");
    return;
  }

  const dataURL = canvas.toDataURL("image/png");
  const link = document.createElement("a");

  link.href = dataURL;
  link.download = "canvas.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ===============================
// Read file as Base64
// ===============================
export const reader = (file) =>
  new Promise((resolve, reject) => {
    if (!file || !(file instanceof Blob)) {
      reject(new Error("Invalid file: not a Blob"));
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = () =>
      reject(new Error("File reading failed"));

    fileReader.readAsDataURL(file);
  });

// ===============================
// Get contrasting text color
// ===============================
export const getContrastingColor = (color) => {
  if (!color) return "black";

  const hex = color.replace("#", "");

  if (hex.length !== 6) return "black";

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  return brightness > 128 ? "black" : "white";
};
