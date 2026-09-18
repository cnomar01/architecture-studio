export async function prepareAvatar(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select an image.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be smaller than 5MB.");
  }

  const bitmap = await createImageBitmap(file);

  const maxSize = 600;
  const scale = Math.min(
    1,
    maxSize / Math.max(bitmap.width, bitmap.height)
  );

  const canvas = document.createElement("canvas");

  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not process image.");
  }

  context.drawImage(
    bitmap,
    0,
    0,
    canvas.width,
    canvas.height
  );

  bitmap.close();

  return canvas.toDataURL("image/webp", 0.82);
}