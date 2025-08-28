export const splitArray = (array, chunkSize) => {
  if (!Array.isArray(array)) {
    throw new Error("First argument must be an array");
  }
  if (typeof chunkSize !== "number" || chunkSize <= 0) {
    throw new Error("chunkSize must be a positive number");
  }

  const chunks = Array.from(
    { length: Math.ceil(array.length / chunkSize) },
    (_, index) => array.slice(index * chunkSize, index * chunkSize + chunkSize)
  );

  return chunks;
};
