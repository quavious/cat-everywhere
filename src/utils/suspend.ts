/* eslint-disable import/prefer-default-export */
const suspend = async (ms: number = 2000) =>
  new Promise((res, rej) => {
    setTimeout(() => {
      try {
        res(null);
      } catch (err) {
        rej(err);
      }
    }, ms);
  });

export { suspend };
