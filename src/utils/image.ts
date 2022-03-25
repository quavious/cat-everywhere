/* eslint-disable no-unused-vars */
enum ImageStatus {
  NORMAL,
  MOVE,
  STOP,
}

export const convertFileToBuffer = async (files: FileList | null): Promise<[string, string] | null> => {
  if (!files) return null;
  const file = files[0];
  const ext = file.name.split('.').pop();
  if (!ext) return null;

  try {
    const buf = await file.arrayBuffer();

    let bin = '';
    const array = new Uint8Array(buf);
    array.forEach((el) => {
      bin += String.fromCharCode(el);
    });
    return [ext, bin];
  } catch (err) {
    return null;
  }
};

export default ImageStatus;
